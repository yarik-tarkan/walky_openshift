########################
##author : Demidovskij A.
##last update : 16.03 31.08.14
########################

from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseForbidden
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from django.template import loader
from django.template.loader import render_to_string
import json
import sqlite3
from jsdev.models import RouteInfo, RoutePoints, RouteImages, UserLikes, Cities
import random
from django.core import serializers
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import User
from django.contrib import auth
from django.core.context_processors import csrf
from django.contrib.auth.forms import UserCreationForm
from jsdev.forms import MyRegistrationForm
from collections import OrderedDict
from django.utils.safestring import mark_safe


def routes2dic(routes_list):
  """Function gets list of RouteInfo instances and convert it to the dictionary,
  which then renders in django template on the client side"""
  routes_dic = OrderedDict()
  for route in routes_list:
    #print route.route_id
    routes_dic[route.route_id] = {}
    routes_dic[route.route_id]["route_name"] = route.route_name
    routes_dic[route.route_id]["route_type"] = route.route_type
    routes_dic[route.route_id]["route_likes"] = route.route_likes
    routes_dic[route.route_id]["route_city"] = route.route_city
    routes_dic[route.route_id]["route_length"] = route.route_length
    routes_dic[route.route_id]["route_duration"] = route.route_duration
    #Load the same map image for all routes in dictionary
    #routes_dic[route.route_id]["route_image_url"] = RouteImages.objects.get(route_id=54).route_img.url
    routes_dic[route.route_id]["route_image_url"] = RouteImages.objects.get(route_id=route.route_id).route_img.url
  return routes_dic

def index(request):
# """ Function initializes the first page with route lists
# if there is no route: creates three default
# renderers in the django template"""
    routeType = "pedestrian"
    #get_route(request,1)
    # print RouteInfo.objects.all().delete()
    routesList = RouteInfo.objects.filter(route_type=routeType)\
                                    .order_by('-route_date')
    print "list: ",routesList
    if len(routesList) == 0:
        #Pass empty dictioanary to template
        routes_dic = OrderedDict()
        return render(request, 'jsdev/index.html', \
            {"routes_dic": routes_dic, \
            "is_auth":request.user.is_authenticated(), \
            "username":request.user})
        #Unused template route creation
        """tmp1 = RouteInfo(route_name="My first {} route".format(routeType),
                                                 route_author=1,
                                                 route_city="N.N.",
                                                 route_type=routeType,
                                                 route_length=random.random(),
                                                 route_duration=random.random(),
                                                 route_likes = 1)
                                tmp1.save()
                                tmp2 = RouteInfo(route_name="My second {} route".format(routeType),
                                                 route_author=2,
                                                 route_city="N.N.",
                                                 route_type=routeType,
                                                 route_length=random.random(),
                                                 route_duration=random.random(),
                                                 route_likes = 2)
                                tmp2.save()
                                tmp3 = RouteInfo(route_name="My third {} route".format(routeType),
                                                 route_author=3,
                                                 route_city="N.N.",
                                                 route_type=routeType,
                                                 route_length=random.random(),
                                                 route_duration=random.random(),
                                                 route_likes = 3)
                                tmp3.save()
                        
                                routesList = RouteInfo.objects.filter(route_type=routeType)\
                                                            .order_by('-route_date')"""

    routes_dic = routes2dic(routesList)
    print routes_dic

    #city box data
    queryset = Cities.objects.all()
    print([p.city_name for p in queryset])
    response_data = {}
    i = 0
    for p in queryset:
      response_data[i] = {"city_id":p.city_id, "city_name": p.city_name, "city_lattitude": p.city_lattitude, "city_longitude": p.city_longitude}
      i=i+1
    print json.dumps(response_data)
    return render(request, 'jsdev/index.html', \
        {"routes_dic": routes_dic, \
        "is_auth":request.user.is_authenticated(), \
        "username":request.user, \
        "cities_json":json.dumps(response_data)})

def getRoutes(request,route_type):
  # """Function gets all objects of routes of requested type 
  # and rerenders the extended template index_routes_ext.html"""
  print "in get_info " + route_type

  
  if request.method == "GET":
    routes_dic = {}
    print "Get request"
    route_type = request.GET["route_type"]
    category_type = request.GET["category_type"]
    print category_type
    print route_type
    routesList = []
    sort_order = {}
    # routesList = RouteInfo.objects.filter(route_type=route_type)
    if category_type == "top":
      routesList = RouteInfo.objects.filter(route_type=route_type)\
                                    .order_by('-route_likes')
    elif category_type == "new":
      routesList = RouteInfo.objects.filter(route_type=route_type)\
                                    .order_by('-route_date')
      
    res =  routes2dic(routesList)
    
    topic_list = json.dumps({'routes_dic': routes_dic})
    print routesList
    return render_to_response('jsdev/index_routes_ext.html', {'routes_dic': res})
  return HttpResponse(topic_list)

#Function gets json file of dictionary containing all info abut the route
#Saves all info in DB
#Returns empty HttpResponse()
@csrf_exempt
def save_route(request):
    route_dic = {}
    #TODO: make user mdels and save in routes using authors
    if request.method == "POST":
        routes_dic = {}
        print "Get request"
        print request
        route_dic = json.loads(request.POST["routes_dic"])[0]
        print "Read!"
    else:
        json_info = """{
        "route_name":"NAMEE",
        "user_name":"walkyuser",
        "route_distance":"0.799",
        "route_duration":10,
        "route_type":"pedestrian",
        "route_city":"N.N.",
        "encoded_path":"imuvI{`qjGMHi@^??CqAIiFMkHGkCGeFMyHKqGKmI_@qXCgAGsDKkHK{F?KKwFK{IE{EGcDCmCC}CAYAcBCwCG{DIuEGwA?EGa@MuHIuFIuFGiGEeE??HODGHGLIRG??LJNPHTFXH`@NnA??FSDOFI@C@A@?@AB?HAN?R@???z@?N?^AVAP?R?L???M?S@Q@W?_@???O?{@??SAO?I@C?A@A?A@ABGHENGR??OoAIa@GYIUOQMKQQGGIIKMO]??OkKGsEKcHOaKMsIMyKI_GAaAI_FCsACkCQoLIqFCyBEqB",
        "route_points":[
        {
        "point_id":0,
        "point_lat":40.73855929950343,
        "point_lng":-73.78789186477661,
        "point_name":"N1",
        "point_description":"D1"
        },
        {
        "point_id":1,
        "point_lat":40.73756753107997,
        "point_lng":-73.78499507904053,
        "point_name":"n2",
        "point_description":"d2"
        },
        {
        "point_id":2,
        "point_lat":40.73995750527805,
        "point_lng":-73.78284931182861,
        "point_name":"n3",
        "point_description":"d3"
        }
        ]
        }"""
        route_dic = json.loads(json_info)    
    print route_dic
    print route_dic["user_name"]
    author = User.objects.get(username = route_dic["user_name"])
    print "author: ", author
    if author == None:
        print "No such author"
        return

    
    route = RouteInfo(route_name=route_dic["route_name"],
                     route_author=author.id,
                     route_city=route_dic["route_city"],
                     route_type=route_dic["route_type"],
                     route_length=route_dic["route_distance"],
                     route_duration=route_dic["route_duration"],
                     route_likes = 0,
                     route_hash = route_dic["encoded_path"])
    route.save()

    #Save route path image to RouteImages table via save()
    map_image = RouteImages(route_id=route.route_id)
    #Save to media/map_privew/
    map_image.save()

    print "route: ", route.route_type
    route_points = []
    for point in route_dic["route_points"]:
        p = RoutePoints(route_id = route.route_id,
                        point_longitude = point["point_lng"],
                        point_latitude = point["point_lat"],
                        point_name = point["point_name"],
                        point_description = point["point_description"],
                        point_order = point["point_id"])
        p.save()
        print p
    return HttpResponse()

#Function for getting info from db about route, points, author
#expects route like: /routes/id
#Returns rendered in a template json 
def get_route(request, route_id):
    # print request.PATH
    author_name = "walkyuser"
    # route_id  = 1
    
    points = RoutePoints.objects.filter(route_id = route_id)

    route = RouteInfo.objects.get(route_id = route_id)
    author = User.objects.get(id = route.route_author)
    result_dic = {}
    route_points = []
    for point in points:
        point_dic = {}
        point_dic["point_id"] = point.point_order
        point_dic["point_lat"] = point.point_latitude
        point_dic["point_lng"] = point.point_longitude
        point_dic["point_name"] = point.point_name
        point_dic["point_description"] = point.point_description
        
        route_points.append(point_dic)
    
    # print route_points
    
    result_dic["route_name"] = route.route_name
    result_dic["user_name"] = author.username
    result_dic["route_distance"] = route.route_length
    result_dic["route_duration"] = route.route_duration
    result_dic["route_type"] = route.route_type
    result_dic["route_city"] = route.route_city
    result_dic["route_likes"] = route.route_likes
    result_dic["encoded_path"] = route.route_hash
    result_dic["route_points"] = route_points

    dmp = json.dumps(result_dic)
    print dmp
    has_liked = UserLikes.objects.filter(route_id = route_id, route_author = request.user.id)
    print has_liked
    return render(request,'jsdev/route_view.html', \
                            {"result_dic": mark_safe(dmp), \
                            "is_auth":request.user.is_authenticated(), \
                            "username":request.user, \
                            "has_liked":has_liked})

#Function for like mechanism
#expects route like: /routes/id/like_view
#Returns json HttpResponse with success_code(200) or error(-100)
@csrf_exempt  
def like_route(request, route_id):
    route = RouteInfo.objects.get(route_id = route_id)
    print route.route_date
    if route is not None:
        route.route_likes += 1
        route.save()
        like_author = UserLikes(route_id = route, route_author = request.user)
        like_author.save()
        success_response = json.dumps({"response_code":200, "message":"route is liked"});
        return HttpResponse(success_response)
    else:
        error_response = json.dumps({"response_code":-100, "message":"Error: route is not liked:not found"});
        return HttpResponse(error_response)

#@login_required(login_url='/login/')
def addRoutePage(request):
    #return render(request, 'jsdev/addRoute.html', {})
    if request.user.is_authenticated():
      return render(request, 'jsdev/add_route.html', {"username":request.user})
    else:
        #return HttpResponseForbidden()
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied()
        
#############################################################
#####Deprecated functionality
#####Needs to be rewritten if important or to be got rid of in future releases
#############################################################
def mapsdraw(request):
    text = 'demid'
    t = get_template('jsdev/mapsdraw.html')
    # html = t.render(Context({'text': text}))
    html = t.render(Context({}))
    return HttpResponse(html)


def maps_test(request):
    route = 'from Moscow to NN'
    t = get_template('jsdev/maps_test.html')
    html = t.render(Context({'route': route}))
    return HttpResponse(html)


def get_points(request):
    # allpoints = RouteInfo.objects.all()
    js_data = {}
    # print allpoints[0].latitude
    t = get_template('jsdev/map_from_db.html')
    points_array = {}

    points_array["point_0"] = {'lat': '56.268440', 'lon': '43.877693'}
    points_array["point_1"] = {'lat': '56.298745', 'lon': '43.944931'}
    points_array["point_2"] = {'lat': '56.325152', 'lon': '44.022191'}
    # return HttpResponse(json.dumps(js_data), mimetype='application/json')
    return render_to_response('jsdev/map_from_db.html', {"obj_as_json": simplejson.dumps(points_array)})



@csrf_exempt
def send_points(environ):
    # allpoints = Routepoint.objects.all()
    # print allpoints
    if environ.is_ajax():
        message = "Yes, AJAX!"  # + (str)(environ.POST)
        # jInfo = json.loads(environ.POST.keys()[0])
        jInfo = json.loads(environ.body)
        # print jInfo
        # print jInfo['start']['A']
        for i in jInfo.keys():
            print "Key = ",  i,  " Latitude = ", jInfo[i]['lat'], " Longitude = ", jInfo[i]['lon']
            # point = Routepoint(pointname=i, route=route , latitude=jInfo[i]['lat'], longitude=jInfo[i]['lon'])
            # point.save()
    else:
        message = "Not Ajax"
    return HttpResponse(message)


def loginPage(request):
    return render(request, 'jsdev/loginPage.html', {})

def login(request):
  c = {}
  c.update(csrf(request))
  return render_to_response('jsdev/marat_login.html', c)

@csrf_exempt
def auth_view(request):  
  username = request.POST.get('username', '')  
  password = request.POST.get('password', '') 
  print username
  print password

  user = auth.authenticate(username = username,  password = password)

  if user is not None:
    auth.login(request, user)
    t = render_to_string('jsdev/login_box.html', {"is_auth":request.user.is_authenticated(), "username":request.user})
    success_response = json.dumps({"response_code":200, "message":"user authenticated", "template":t});
    #return render_to_response("jsdev/index.html", {"is_auth":request.user.is_authenticated(), "username":request.user}, context_instance = RequestContext(request))
    return HttpResponse(success_response)
  else:
    error_response = json.dumps({"response_code":-100, "message":"Error: invalid login or password"});
    #return render_to_response("jsdev/index.html", {"is_auth":request.user.is_authenticated(), "username":request.user}, context_instance = RequestContext(request))
    return HttpResponse(error_response)


def loggedin(request):
  return render_to_response("jsdev/loggedin.html", {'full_name': request.user.username}) 

def logout(request):
  auth.logout(request)
  #return render_to_response('jsdev/logout.html')
  return HttpResponseRedirect('../')

def invalid(request):
  return render_to_response('jsdev/invalid.html')  

def register_user(request):
  if request.method == 'POST':
    form = MyRegistrationForm(request.POST)
    if form.is_valid():
      form.save()
      return HttpResponseRedirect('../register_success')

  args = {}
  args.update(csrf(request)) 
  args['form'] = MyRegistrationForm()

  return render_to_response('jsdev/register.html', args)   


def register_success(request):
  return render_to_response('jsdev/register_success.html')

@csrf_exempt
def addUser(environ):

    data = {}
    print "in addUser"
    sqlQuery = ""
    user_name = ""

    user_email = ""
    user_password = ""

    conn = sqlite3.connect('db.sqlite3')
    if environ.is_ajax():
        print "is ajax"
        jData = json.loads(environ.body)
        for i in jData.keys():
            data[i] = jData[i]
        # print data["route_name"]
        user_name = data["user_name"]

        user_email = data["user_email"]
        user_password = data["user_password"]
        print "user_name = ",  user_name,   " user_email = ", user_email, " user_password = ", user_password

        # sqlQuery = "INSERT INTO jsdev_routeuser(user_name, user_password, user_email) values(" + user_name + "," + user_password + "," + user_email + ")"
        # conn.execute(sqlQuery)
        # conn.commit()
        # conn.close
        print "before RouteUser()"
        # new_user = RouteUser()
        # new_user.user_name = user_name
        # new_user.user_email = user_email
        # new_user.user_password = user_password
        # new_user.save()
        user = User.objects.create_user(
        username = user_name,
        password = user_password,
        email = user_email
        )
        user.save( )
        print "saved"

    # return render(environ,'jsdev/main_page.html', {})
    return HttpResponse("User created")


def signupPage(request):
    return render(request, 'jsdev/signupPage.html', {})


@csrf_exempt
def authUser(environ):
    data = {}
    print "in authUser"
    user_email = ""
    user_password = ""
    if environ.is_ajax():
        print "is ajax"
        jData = json.loads(environ.body)
        for i in jData.keys():
            data[i] = jData[i]
        # print data["route_name"]
        user_email = data["user_email"]
        user_password = data["user_password"]
       
        print "user_email = ", user_email, " user_password = ", user_password
        authUser = User.objects.filter(email=user_email)
        if (authUser[0].password == user_password):
            return HttpResponse("User Found")
    return HttpResponse("User Not Found")









@csrf_exempt
def addUser(environ):
    data = {}
    print "in addUser"
    sqlQuery = ""
    user_name = ""
    user_surname = ""
    user_email = ""
    user_password = ""

    conn = sqlite3.connect('db.sqlite3')
    if environ.is_ajax():
        print "is ajax"
        jData = json.loads(environ.body)
        for i in jData.keys():
            data[i] = jData[i]
        # print data["route_name"]
        user_name = data["user_name"]
        user_surname = data["user_surname"]
        user_email = data["user_email"]
        user_password = data["user_password"]
        print "user_name = ",  user_name,  " user_surname = ", user_surname, " user_email = ", user_email, " user_password = ", user_password

        # sqlQuery = "INSERT INTO jsdev_routeinfo(route_name, route_likes, route_city, route_length, route_duration) values(" + route_name + "," + route_likes + "," + route_city + "," + route_length + "," + route_duration + ")"
        # conn.execute(sqlQuery)
        # conn.commit()
        # conn.close
        new_user = RouteUser()
        new_user.user_name = user_name
        new_user.user_surname = user_surname
        new_user.user_email = user_email
        new_user.user_password = user_password
        new_user.save()

    # return render(environ,'jsdev/main_page.html', {})
    return HttpResponse()


def signupPage(request):
    return render(request, 'jsdev/signupPage.html', {})


@csrf_exempt
def authUser(environ):
    data = {}
    print "in authUser"
    user_email = ""
    user_password = ""
    if environ.is_ajax():
        print "is ajax"
        jData = json.loads(environ.body)
        for i in jData.keys():
            data[i] = jData[i]
        # print data["route_name"]
        user_email = data["user_email"]
        user_password = data["user_password"]
        print "user_email = ", user_email, " user_password = ", user_password
        authUser = RouteUser.objects.filter(user_email=user_email)
        if (authUser[0].user_password == user_password):
            return HttpResponse("User Found")
    return HttpResponse("User Not Found")





def showRoute(request, routeId):
    # print routeId
    routeInfo = RouteInfo.objects.filter(route_id=routeId)
    routePoints = RoutePoints.objects.filter(route_id=routeId)

    js_data = {}
    # print allpoints[0].latitude

    points_array = {}
    for i in routePoints:
        points_array[i.point_id] = {
            "lat": i.point_latitude, "lon": i.point_longitude}
        # print i.point_id
    # points_array["point_0"] = {'lat':'56.268440' , 'lon':'43.877693'}
    # points_array["point_1"] = {'lat':'56.298745' , 'lon':'43.944931'}
    # points_array["point_2"] = {'lat':'56.325152' , 'lon':'44.022191'}
    # return HttpResponse(json.dumps(js_data), mimetype='application/json')
    #return render_to_response('jsdev/map_from_db.html', {"obj_as_json": simplejson.dumps(points_array)})
    return render_to_response('jsdev/route_view.html', {"obj_as_json": simplejson.dumps(points_array)})


#sends information from Cities database to cities_view.html
def city_info(request):
  queryset = Cities.objects.all()
  print([p.city_name for p in queryset])
  response_data = {}
  i = 0
  for p in queryset:
    response_data[i] = {"city_id":p.city_id, "city_name": p.city_name, "city_lattitude": p.city_lattitude, "city_longitude": p.city_longitude}
    i=i+1
  print json.dumps(response_data)   
  return render_to_response('jsdev/cities_view.html', {"cities_json": json.dumps(response_data)})