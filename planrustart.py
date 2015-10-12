from flask import Flask, render_template, request, redirect, url_for
from collections import OrderedDict
import requests, datetime, json, os, random, string, sqlite3, psycopg2, urlparse

url = "https://sis.rutgers.edu/soc/courses.json?"
arrayOfClasses = []
dictOfClasses = OrderedDict()
urlstr = ""
# urlparse.uses_netloc.append("postgres")
# url = urlparse.urlparse(os.environ["postgres://jbyndnforddiae:zuEvNDnHuXN7YCZdHoDps2mVJN@ec2-75-101-162-243.compute-1.amazonaws.com:5432/d58psn55ra2cvs"])
#
# conn = psycopg2.connect(
#     database=url.path[1:],
#     user=url.username,
#     password=url.password,
#     host=url.hostname,
#     port=url.port
# )

app = Flask(__name__)

@app.route("/<string:url_id>")
def stringredirector(url_id):
    url_id = str(url_id).upper()

    if (len(url_id) != 5):
        return "syntax error: invalid url"

    conn = psycopg2.connect(
        database="updatestringorprogramwillnotrun",
        user="updatestringorprogramwillnotrun",
        password="updatestringorprogramwillnotrun",
        host="updatestringorprogramwillnotrun",
        port="updatestringorprogramwillnotrun"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM listone WHERE URL = %s",(url_id,)) # make sure all searches are using uppercase string!
    ct = cursor.fetchall()


    if len(ct) == 0:
        return "database error: no such url"

    cursor.execute("SELECT INFO FROM listone WHERE URL = %s",(url_id,))
    info = cursor.fetchone()
    conn.close()

    return render_template("calendar.html", information=json.dumps(info))

# @app.route('/getpythondata')
# def get_python_data():
#     return info

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/submit', methods=['GET', 'POST'])
def datareceive():

    arrayOfClasses = []
    info = request.json

    for x in info:
        coursestring = ""
        for y in x:
            if (len(y) == 1):
                y = "0" + y
            coursestring += y
        arrayOfClasses.append(coursestring[:3] + ":" + coursestring[3:6] + " [" + coursestring[6:] + "]")

    print "RECEIVED:"
    print arrayOfClasses

    return json.dumps(classdata(arrayOfClasses))

def generateUniqueURL():

    conn = psycopg2.connect(
        database="updatestringorprogramwillnotrun",
        user="updatestringorprogramwillnotrun",
        password="updatestringorprogramwillnotrun",
        host="updatestringorprogramwillnotrun",
        port="updatestringorprogramwillnotrun"
    )
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS listone (URL TEXT PRIMARY KEY, INFO TEXT, TIMESTAMP TEXT, CUSTOMURL TEXT UNIQUE)")

    urlstr = random.choice(string.ascii_uppercase) + \
             ''.join(random.choice(string.ascii_uppercase + string.digits) for i in range(4))

    cursor.execute("SELECT * FROM listone WHERE URL = %s",(urlstr,))

    print urlstr
    ct = cursor.fetchall()
    conn.close()

    if len(ct) != 0:
        return generateUniqueURL()

    return urlstr

def classdata(arrayOfClasses):

    dictOfClasses.clear()
    allfound = True

    for courses in arrayOfClasses:
        # print("")

        subject = courses[:3]
        subjectFound = False

        course = courses[4:7]
        courseFound = False

        section = courses[courses.index('[')+1:courses.index(']')]
        sectionFound = False

        query = {'subject': subject, 'semester': '92015', 'campus': 'NB', 'level': 'U'}
        r = requests.get(url, params=query)

        # print subject + ":" + course, "[" + section + "]"

        try:
            data = json.loads(r.content)
        except ValueError:
            allfound = False
            dictOfClasses[courses] = OrderedDict([("Found", False), ("MeetingTimes", None), ("ErrMsg", "Subject Not Found"),
                                                  ("Index", None), ("Subject", subject),
                                                  ("Course", course), ("Section", section)])
            # print "SUBJECT NOT FOUND."
            continue

        for courseData in data:

            if courseData['courseNumber'] == course:
                courseFound = True
                course = courseData['courseNumber']
                title = courseData['title']
                for sectiondata in courseData['sections']:
                    if sectiondata['number'] == section:
                        sectionFound = True
                        section = sectiondata['number']
                        meetTimesArray = []

                        for meetingtimes in sectiondata['meetingTimes']:

                            for obj in meetingtimes:
                                if meetingtimes[obj] is None:
                                    meetingtimes[obj] = "N/A"

                            meetTimesArray.append(OrderedDict([("DAY",meetingtimes['meetingDay']),
                                                               ("CAMPUS",meetingtimes['campusName']),
                                                               ("BUILDING",meetingtimes['buildingCode']),
                                                               ("ROOM",meetingtimes['roomNumber']),
                                                               ("START TIME",meetingtimes['startTime']),
                                                               ("END TIME",meetingtimes['endTime']),
                                                               ("MORN-EVE-CODE",meetingtimes['pmCode']),
                                                               ("DURATION",durationCalc(meetingtimes['startTime'],
                                                                                        meetingtimes['endTime'])[0]),
                                                               ("HRS-MINS",durationCalc(meetingtimes['startTime'],
                                                                                        meetingtimes['endTime'])[1]),
                                                               ("TITLE",title),
                                                               ]))

                        dictOfClasses[courses] = OrderedDict([("Found", True), ("MeetingTimes", meetTimesArray),
                                                              ("ErrMsg", None), ("Index", sectiondata['index']),
                                                              ("Subject", subject), ("Course", course), ("Section", section)])

        if not courseFound:
            allfound = False
            dictOfClasses[courses] = OrderedDict([("Found", False), ("MeetingTimes", None), ("ErrMsg", "Course Not Found"),
                                                  ("Index", None), ("Subject", subject),
                                                  ("Course", course), ("Section", section)])
        elif not sectionFound:
            allfound = False
            dictOfClasses[courses] = OrderedDict([("Found", False), ("MeetingTimes", None), ("ErrMsg", "Section Not Found"),
                                                  ("Index", None), ("Subject", subject),
                                                  ("Course", course), ("Section", section)])

    # print "SENDING BACK:"
    # print dictOfClasses

    if (allfound): # urlstr only sends once all courses are valid. this should lead straight to a page redirect.

        # loop to test integrity of DB when faced with many requests per second. make sure to indent following code
        # for x in range(0,10):

        try:
            del dictOfClasses["url"]
        except KeyError:
            pass
        print "ALL FOUND!"
        urlstr = generateUniqueURL()
        dbInsert(urlstr)
        dictOfClasses["url"] = urlstr


    # for d in dictOfClasses:
    #     print d
    #     for items in dictOfClasses[d]:
    #         print "-",items

    return dictOfClasses

def dbInsert(uniqueURL):
    now = datetime.datetime.now()
    conn = psycopg2.connect(
        database="updatestringorprogramwillnotrun",
        user="updatestringorprogramwillnotrun",
        password="updatestringorprogramwillnotrun",
        host="updatestringorprogramwillnotrun",
        port="updatestringorprogramwillnotrun"
    )
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS listone (URL TEXT PRIMARY KEY, INFO TEXT, TIMESTAMP TEXT, CUSTOMURL TEXT UNIQUE)")
    cursor.execute("INSERT INTO listone VALUES (%s, %s, %s, %s)", (uniqueURL, json.dumps(dictOfClasses), now, None))
    conn.commit()
    conn.close()
    return

def durationCalc(starttime, endtime):

    try:
        start = int(starttime)
        end = int(endtime)
    except ValueError:
        return None, None

    if (end < start):
        end += 1200

    # print("START TIME: {0}\nEND TIME: {1}".format(start,end))

    starttimeminutes = ((start/100)*60) + (start%100)
    endtimeminutes = ((end/100)*60) + (end%100)
    durationminutes = endtimeminutes - starttimeminutes
    durationhrsandmin = str(durationminutes/60) + "H" + str(durationminutes%60) + "M"

    # print("STARTTIME HOURS: {0}\nSTARTTIME MINUTES: {1}".format(start/100,start%100))
    # print("ENDTIME HOURS: {0}\nENDTIME MINUTES: {1}".format(end/100,end%100))
    # print("STARTTIME MINUTES: {0}\nENDTIME MINUTES: {1}\nDURATION MINUTES: {2}\n\n".format(starttimeminutes,endtimeminutes,durationminutes))

    return durationminutes, durationhrsandmin





if __name__ == '__main__':

    app.debug = True
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)