from flask import Flask, render_template, request, redirect, url_for, session, flash

app = Flask(__name__)
app.secret_key = 'nqu_mock_secret_key'

# --- 模擬資料庫 ---
USERS = {
    '11200001': {'password': '123', 'name': '王小明', 'role': 'student'}
}

COURSES = [
    {'id': 'C001', 'name': '計算機概論', 'credits': 3, 'teacher': '李教授', 'type': '必修', 'day': '一', 'periods': [2, 3, 4]},
    {'id': 'C002', 'name': '程式設計', 'credits': 3, 'teacher': '林教授', 'type': '必修', 'day': '二', 'periods': [6, 7, 8]},
    {'id': 'C003', 'name': '網頁前端設計', 'credits': 3, 'teacher': '陳教授', 'type': '選修', 'day': '四', 'periods': [2, 3, 4]},
    {'id': 'C004', 'name': '資料結構', 'credits': 3, 'teacher': '黃教授', 'type': '必修', 'day': '三', 'periods': [2, 3, 4]},
    {'id': 'C005', 'name': '體育', 'credits': 1, 'teacher': '張教練', 'type': '必修', 'day': '五', 'periods': [6, 7]},
]

GRADES = {
    '11200001': [
        {'semester': '114-1', 'course_name': '國文', 'credits': 2, 'score': 85},
        {'semester': '114-1', 'course_name': '英文', 'credits': 2, 'score': 78},
        {'semester': '114-1', 'course_name': '微積分', 'credits': 3, 'score': 92},
        {'semester': '114-1', 'course_name': '體育', 'credits': 1, 'score': 88}
    ]
}

# --- 路由與功能 ---
@app.route('/')
def home():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_id = request.form.get('user_id')
        password = request.form.get('password')
        captcha = request.form.get('captcha')
        
        if captcha != '1234':
            flash('驗證碼錯誤 (請輸入1234)', 'danger')
            return render_template('login.html')

        user = USERS.get(user_id)
        if user and user['password'] == password:
            session['user_id'] = user_id
            session['name'] = user['name']
            return redirect(url_for('dashboard'))
        else:
            flash('學號或密碼錯誤！(測試帳號: 11200001 / 密碼: 123)', 'danger')
            
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html', name=session['name'])

@app.route('/course_select', methods=['GET', 'POST'])
def course_select():
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    if 'my_courses' not in session:
        session['my_courses'] = []

    if request.method == 'POST':
        course_id = request.form.get('course_id')
        action = request.form.get('action')
        
        my_courses = session['my_courses']
        if action == 'add' and course_id not in my_courses:
            my_courses.append(course_id)
        elif action == 'drop' and course_id in my_courses:
            my_courses.remove(course_id)
        
        session['my_courses'] = my_courses
        flash('選課狀態已更新！', 'success')
        return redirect(url_for('course_select'))

    my_courses_data = [c for c in COURSES if c['id'] in session['my_courses']]
    available_courses = [c for c in COURSES if c['id'] not in session['my_courses']]

    return render_template('course_select.html', 
                           name=session['name'], 
                           my_courses=my_courses_data, 
                           available_courses=available_courses)

@app.route('/grades')
def grades():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    my_grades = GRADES.get(user_id, [])
    
    avg_score = 0
    if my_grades:
        total = sum(g['score'] for g in my_grades)
        avg_score = round(total / len(my_grades), 2)

    return render_template('grades.html', name=session['name'], grades=my_grades, avg_score=avg_score)

@app.route('/timetable')
def timetable():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    my_course_ids = session.get('my_courses', [])
    my_courses_data = [c for c in COURSES if c['id'] in my_course_ids]

    days = ['一', '二', '三', '四', '五']
    periods = range(1, 9)

    schedule_grid = {p: {d: None for d in days} for p in periods}

    for course in my_courses_data:
        day = course['day']
        for p in course['periods']:
            if p in schedule_grid and day in schedule_grid[p]:
                schedule_grid[p][day] = course['name']

    return render_template('timetable.html', 
                           name=session['name'], 
                           days=days, 
                           periods=periods, 
                           schedule=schedule_grid)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)