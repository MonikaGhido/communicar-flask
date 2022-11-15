
from json import JSONDecodeError

from flask import Flask, render_template, request, Response

userRegistrationList = [] #Rappresenta il dataset del file Sql

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/car_registration', methods=['POST'])
def carRegistration():

    print("A user registration has arrived...")


    try:

        #ottengo dizionario
        userRegistrationModel = request.get_json(force=True)


        #controllo se la registrazione è già presente
        for user in userRegistrationList:
            if(userRegistrationModel["name"] == user["name"] and userRegistrationModel["license_plate"] == user["license_plate"]):
                print('\033[91m' + "User Registration already exists " + '\033[0m')
                return {'error ': " User Registraion already exists "}, 409

        #aggiorno il database
        userRegistrationList.append(userRegistrationModel)
        print('\033[92m' + "User Registration Created" + '\033[0m' )

        print("Data:" + str(userRegistrationList))

        return Response(status=201, content_type='application/json')

    except JSONDecodeError:
        print('\033[91m' + "Error Invalid JSON ! Check the request " + '\033[0m' )
        return {'error ': " Invalid JSON ! Check the request "}, 400

    except Exception as e:
        print('\033[91m' +"error :  Generic Internal Server Error ! Reason : " + str(e) + '\033[0m')
        return {'error ': " Generic Internal Server Error ! Reason : " + str(e)}, 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
