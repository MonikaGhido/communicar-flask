from flask import Flask, render_template, request
import json
import time
import uuid

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/submit', methods=['POST'])
def submit():
    survey_id = f"{uuid.uuid4()}_{int(time.time())}"

    with open(f'./survey_data/{survey_id}.json', 'w') as fp:
        data = json.loads(list(request.form.keys())[0])
        print(data)
        json.dump(data, fp)

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}


@app.route('/thanks.html', methods=['GET'])
def thanks():
    return render_template("thanks.html")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
