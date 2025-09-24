from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.decorators import api_view
from core.models.models import Reports, Penalties, TowTrucks, TrafficLight, EvacuationRoute, DTP
from core.utils.auth_decor import admin_required
from core.utils.serializers import ReportsSerializer
from django.core.files.base import ContentFile
import pandas as pd
import io, zipfile, os, csv
from django.http import HttpResponse

@api_view(['GET'])
@admin_required
def getReport(request: Request):
    reports = Reports.objects.all()
    serializer = ReportsSerializer(reports, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@admin_required
def createReport(request: Request):
    try:
        data = request.data
        filename = "_".join(data['filename'].split())
        if Reports.objects.filter(file = filename).exists():
            return Response("Такая запись уже существует", status=status.HTTP_400_BAD_REQUEST)
        
        content_file = ContentFile(b"", filename)
        report = Reports(file=content_file)
        report.save()
        return Response("Успешно созданно", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@admin_required
def deleteReport(request: Request):
    try:
        data = request.data
        report = Reports.objects.get(id=data['id'])
        report.delete()
        return Response("Успешно удалено", status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@admin_required
def downloadReport(request: Request):
    try:
        # Accept id from query params primarily; fallback to request.data for compatibility
        report_id = request.GET.get('id') or request.data.get('id')
        export_format = (request.GET.get('format') or request.data.get('format') or 'xlsx').lower()
        if not report_id:
            return Response("Не передан параметр id", status=status.HTTP_400_BAD_REQUEST)

        report = Reports.objects.get(id=report_id)

        # Build DataFrames for each related dataset if present
        datasets = {}

        penalties_qs = Penalties.objects.filter(report=report).order_by('date')
        if penalties_qs.exists():
            datasets['Penalties'] = pd.DataFrame(list(penalties_qs.values(
                'date', 'violations_cumulative', 'decrees_cumulative',
                'fines_imposed_cumulative', 'fines_collected_cumulative'
            )))

        tow_qs = TowTrucks.objects.filter(report=report).order_by('date')
        if tow_qs.exists():
            datasets['TowTrucks'] = pd.DataFrame(list(tow_qs.values(
                'date', 'tow_truck_in_line', 'count_departures', 'count_evacuations', 'summary_of_parking_lot'
            )))

        tl_qs = TrafficLight.objects.filter(report=report).order_by('numPP')
        if tl_qs.exists():
            datasets['TrafficLights'] = pd.DataFrame(list(tl_qs.values('numPP', 'address', 'type', 'year')))

        evac_qs = EvacuationRoute.objects.filter(report=report).prefetch_related('routes').order_by('year', 'month')
        if evac_qs.exists():
            evac_rows = []
            for obj in evac_qs:
                route_names = [r.street for r in obj.routes.all()]
                evac_rows.append({
                    'year': obj.year,
                    'month': obj.month,
                    'routes': ' → '.join(route_names)
                })
            datasets['EvacuationRoute'] = pd.DataFrame(evac_rows)

        dtp_qs = DTP.objects.filter(report=report).order_by('year', 'month', 'statistical_factor')
        if dtp_qs.exists():
            datasets['DTP'] = pd.DataFrame(list(dtp_qs.values('year', 'month', 'point_FPSR', 'statistical_factor', 'count')))

        if not datasets:
            return Response("Нет данных для этого отчета", status=status.HTTP_404_NOT_FOUND)

        base_filename = os.path.splitext(os.path.basename(report.file.name or f"report_{report.id}"))[0]

        if export_format == 'xlsx':
            buffer = io.BytesIO()
            with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
                for sheet_name, df in datasets.items():

                    df = df.copy()
                    for col in df.columns:
                        if str(df[col].dtype).startswith('datetime'):
                            df[col] = pd.to_datetime(df[col]).dt.date
                    df.to_excel(writer, sheet_name=sheet_name[:31], index=False)
            buffer.seek(0)
            resp = HttpResponse(buffer.getvalue(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            resp['Content-Disposition'] = f'attachment; filename="{base_filename}.xlsx"'
            return resp

        if export_format == 'csv':
            # Create a ZIP with one CSV per dataset using Windows-friendly settings (cp1251, ';' sep, CRLF)
            zbuf = io.BytesIO()
            with zipfile.ZipFile(zbuf, 'w', zipfile.ZIP_DEFLATED) as zf:
                for name, df in datasets.items():
                    tmp = df.copy()
                    # Normalize datetimes to ISO date strings
                    for col in tmp.columns:
                        if str(tmp[col].dtype).startswith('datetime'):
                            tmp[col] = pd.to_datetime(tmp[col]).dt.strftime('%Y-%m-%d')
                    # Replace unicode arrows to ASCII to be safe with cp1251
                    if 'routes' in tmp.columns:
                        tmp['routes'] = tmp['routes'].astype(str).str.replace('→', '->', regex=False)
                    csv_text = tmp.to_csv(index=False, sep=';', lineterminator='\r\n', decimal=',', quoting=csv.QUOTE_MINIMAL)
                    csv_bytes = csv_text.encode('cp1251', errors='replace')
                    zf.writestr(f"{name}.csv", csv_bytes)
            zbuf.seek(0)
            resp = HttpResponse(zbuf.getvalue(), content_type='application/zip')
            resp['Content-Disposition'] = f'attachment; filename="{base_filename}.zip"'
            return resp

        return Response("Неподдерживаемый формат. Используйте 'xlsx' или 'csv'", status=status.HTTP_400_BAD_REQUEST)
    except Reports.DoesNotExist:
        return Response("Отчет не найден", status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(e)
        return Response("Некоректные данные", status=status.HTTP_400_BAD_REQUEST)