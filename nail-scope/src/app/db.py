import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

db_config = {
   "host": os.getenv('MYSQL_HOST'),
   "user": os.getenv('MYSQL_USER'),
   "password": os.getenv('MYSQL_PASSWORD'),
   "database": os.getenv('MYSQL_DATABASE')
}

def get_db_connection():
    return mysql.connector.connect(**db_config)
