import sqlite3

def create_connection():
    conn = sqlite3.connect("neuroscope.db", check_same_thread=False)
    return conn

def create_table():
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        burnout_level TEXT,
        burnout_score TEXT,
        sleep_risk TEXT,
        digital_addiction_level TEXT,
        digital_addiction_score TEXT
    )
    """)

    conn.commit()
    conn.close()

def insert_report(data):
    conn = create_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO reports
    (burnout_level, burnout_score, sleep_risk, digital_addiction_level, digital_addiction_score)
    VALUES (?, ?, ?, ?, ?)
    """, (
        data.get("Burnout Level"),
        data.get("Burnout Score"),
        data.get("Sleep Risk"),
        data.get("Digital Addiction Level"),
        data.get("Digital Addiction Score")
    ))

    conn.commit()
    conn.close()