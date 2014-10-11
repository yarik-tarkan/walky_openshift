from django.db import models
from PIL import Image
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.conf import settings

# Create your models here.
class RouteInfo(models.Model):
	route_id = models.AutoField(primary_key=True,blank=False)
	route_author = models.IntegerField(default=0,blank=False)
	route_name = models.CharField(max_length=45,blank=False)
	route_likes = models.IntegerField(default=0,blank=False)
	route_date = models.DateField(auto_now_add=True)
	route_city = models.CharField(max_length=45,blank=False)
	route_length = models.FloatField(blank=False)
	route_duration = models.FloatField(blank=False)
	route_type = models.CharField(default="pedestrian",blank="False",max_length=45)
	route_hash = models.CharField(max_length=1000,blank=False)
	def __unicode__(self):
		return "<RouteInfo name:{}>".format(self.route_name) 

class RoutePoints(models.Model):

	point_id = models.AutoField(primary_key=True,blank=False)
	route_id = models.IntegerField(blank=False)
	point_longitude = models.FloatField(blank=False)
	point_latitude = models.FloatField(blank=False)
	point_name = models.CharField(max_length=140,blank=True)
	point_description = models.CharField(max_length=420,blank=True)
	point_order = models.IntegerField(blank=False)
	def __unicode__(self):
		return str(self.route_id)

class RouteImages(models.Model):
	image_id = models.AutoField(primary_key=True,blank=False)
	route_id = models.IntegerField(blank=False)
	#image_name = models.CharField(max_length=45,blank=False)
	#image_path = models.CharField(max_length=200,blank=False)
	route_img = models.ImageField(upload_to="map_preview/",blank=True, null=True)
	#image_entity = models.ImageField(upload_to='.')

	def save(self, *args, **kwargs):
		if self.route_id:
			import urllib, os
			from jsdev.models import RouteInfo 
			image_url_base = "http://maps.googleapis.com/maps/api/staticmap?size=400x200&path=weight:5|color:blue|enc:"
			file_save_dir = "media/map_preview/"
			route = RouteInfo.objects.get(route_id=self.route_id)
			filename = str(route.route_id)+".jpg"
			image_url=image_url_base + str(route.route_hash)
			print image_url
			#f = open(os.path.join(file_save_dir, filename), 'wb')
			f = open(os.path.join("var/lib/openshift/543113c6500446f719001953/app-root/runtime/repo/wsgi/walkysite/", file_save_dir, filename), 'wb')
			f.write( urllib.urlopen(image_url).read() )
			f.close();
			print "written"
			self.route_img = os.path.join(file_save_dir, filename)
		super(RouteImages, self).save()

	def __unicode__(self):
		return str(self.route_id)


class UserLikes(models.Model):
	id = models.AutoField(primary_key=True,blank=False)
	route_id = models.ForeignKey('RouteInfo', db_column='route_id')
	route_author = models.ForeignKey(User, db_column='route_author')

	def __unicode__(self):
		return str(self.route_id)

#class RouteComments(models.Model):
#	comment_id = models.AutoField(primary_key=True,blank=False)
#	route_id = models.IntegerField(blank=False)
#	user_id = models.IntegerField(blank=False)
#	comment_name = models.CharField(max_length=45,blank=False)
class Cities(models.Model):
	city_id = models.AutoField(primary_key=True,blank=False)
	city_name = models.CharField(max_length=45,blank=False)
	city_lattitude = models.FloatField(blank=False)
	city_longitude = models.FloatField(blank=False)
#	comment_text = models.TextField(blank=False)
#
#	def __unicode__(self):
#		return self.comment_name
#
#class RouteUser(models.Model):
#	user_id = models.AutoField(primary_key=True,blank=False)
#	user_name = models.CharField(max_length=45,blank=False)
#	user_password = models.CharField(max_length=45,blank=False)
#	user_email = models.EmailField(blank=False)
#
#	def __unicode__(self):
#		return self.user_name