from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

# Home page
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint to store calories burnt
@app.route('/store-calories-burnt', methods=['POST'])
def store_calories_burnt():
    data = request.get_json()
    date = datetime.now().date().isoformat()
    calories_burnt = data['caloriesBurnt']
    store_calories_in_database('calories_burnt', date, calories_burnt)
    return 'Calories Burnt Stored'

# API endpoint to store calories consumed
@app.route('/store-calories-consumed', methods=['POST'])
def store_calories_consumed():
    data = request.get_json()
    date = datetime.now().date().isoformat()
    calories_consumed = data['caloriesConsumed']
    store_calories_in_database('calories_consumed', date, calories_consumed)
    return 'Calories Consumed Stored'

# API endpoint to get total calories burnt for a given date
@app.route('/get-calories-burnt', methods=['GET'])
def get_total_calories_burnt():
    date = request.args.get('date')
    total_calories_burnt = get_total_calories('calories_burnt', date)
    return jsonify({'totalCaloriesBurnt': total_calories_burnt})

# API endpoint to get total calories consumed for a given date
@app.route('/get-calories-consumed', methods=['GET'])
def get_total_calories_consumed():
    date = request.args.get('date')
    total_calories_consumed = get_total_calories('calories_consumed', date)
    return jsonify({'totalCaloriesConsumed': total_calories_consumed})

# Function to store calories burnt or consumed in the database
def store_calories_in_database(table_name, date, calories):
    conn = sqlite3.connect('fitness.db')
    c = conn.cursor()
    c.execute(f'CREATE TABLE IF NOT EXISTS {table_name} (date TEXT, calories REAL)')
    c.execute(f'INSERT INTO {table_name} (date, calories) VALUES (?, ?)', (date, calories))
    conn.commit()
    conn.close()

# Function to get total calories burnt or consumed for a given date
def get_total_calories(table_name, date):
    conn = sqlite3.connect('fitness.db')
    c = conn.cursor()
    c.execute(f'SELECT SUM(calories) FROM {table_name} WHERE date = ?', (date,))
    total_calories = c.fetchone()[0]
    conn.close()
    return total_calories

if __name__ == '__main__':
    app.run(debug=True)
