import pandas as pd
import os
from django.core.files.uploadedfile import UploadedFile
class ExcelParser:
    def __init__(self, file:str | UploadedFile) -> None:
        self.file = file
        if not self._is_open():
            raise Exception("File is empty")
        self.df = pd.read_excel(self.file, sheet_name=0)
    
        
        # self.df['date'] = pd.to_datetime(self.df['date']).reset_index(drop=True)
        
        # self.df = self.df.sort_values('date')
        
        
    def _is_open(self)->bool:
        try:
            if pd.read_excel(self.file, sheet_name=0).empty:
                return False
            return True
        except Exception as e:
            print(e)
            return False


        


if __name__ == "__main__":
    file_path = "Book 1.xlsx"
    absolut_path = os.path.join(os.path.dirname(__file__), file_path)
    data = ExcelParser(absolut_path)
    print(data.df['date'].to_dict().values())