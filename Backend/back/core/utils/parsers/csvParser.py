import pandas as pd
import os
from django.core.files.uploadedfile import UploadedFile
class CsvParser:
    def __init__(self, file:str | UploadedFile) -> None:
        self.file = file
        self.df = None 
        if isinstance(file, str):
            try:
                self.df = pd.read_csv(file)
            except pd.errors.EmptyDataError:
                raise Exception("File is empty")
        elif isinstance(file, UploadedFile):
            file.seek(0)
            self.df = pd.read_csv(file)
            if self.df.empty:
                raise Exception("File is empty")
        else:
            raise Exception("File type is not supported")
    
        
        # self.df['date'] = pd.to_datetime(self.df['date']).reset_index(drop=True)
        
        # self.df = self.df.sort_values('date')
        
        
    def _is_open(self)->bool:
        try:
            if pd.read_csv(self.file).empty:
                return False
            return True
        except Exception as e:
            print(e)
            return False


        


if __name__ == "__main__":
    file_path = "data-20250818-structure-20210728.csv"
    absolut_path = os.path.join(os.path.dirname(__file__), file_path)
    data = CsvParser(absolut_path).df
    print(data.columns)