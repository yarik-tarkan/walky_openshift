"""Module for inserting default values in db
How to use:
open shell: python manage.py shell
import module:  import jsdev.load_default_routes
done

"""


import os
import sys
import sqlite3

from django.db import transaction
from jsdev.models import RouteInfo, RoutePoints

for i in range(0,5):
  r = RouteInfo(route_author=i,route_name="DefaultRoute"+str(i),route_likes=i,route_city="Moscow",route_length=i*2.4,route_duration=i*1.5)
  point1 = RoutePoints(route_id=i,point_longitude=56.310054+i,point_latitude=43.997051+i)
  point2 = RoutePoints(route_id=i,point_longitude=56.314124+i,point_latitude=43.991215+i)
  point3 = RoutePoints(route_id=i,point_longitude=56.314124+i,point_latitude=43.991215+i)
  r.save()
  point1.save()
  point2.save()
  point3.save()
#transaction.commit()



