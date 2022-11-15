import json

from flask import Flask, render_template, request

user_registration = []

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/car_registration', methods=['POST'])
def carRegistration():
    print("A user registration has arrived...")

    data = request
    if ( data.json == None):
        print("Error - empty body or incorrect syntax ")

    user_registration.append(data.json)


    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
