import os
from uuid import UUID
from typing import List
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "../../../app.sqlite")

print("Full path:", os.path.abspath(DB_PATH))

class SQLiteFallBackEventRepository:

    @staticmethod
    def getFallBackEvent(llm_id: UUID) -> List[str]:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            query = "SELECT llm_id FROM fall_back_event WHERE llm_id = ?"
            cursor.execute(query, (str(llm_id),))
            rows = cursor.fetchall()
        except sqlite3.OperationalError as e:
            print("Error!!!")
             # Table does not exist — return empty result instead of throwing
            if "no such table" in str(e).lower():
                return []
            else:
                raise  # re-throw any other DB issue
        finally:
            conn.close()
            return rows
