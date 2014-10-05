from django.conf.urls import patterns, url
from jsdev import views

urlpatterns = patterns('',
    # ex: /polls/
    url(r'^$', views.index, name='index'),
    #url(r'^like_category/$', views.like_category, name='like_category'),
    #url(r'^mapsdraw/$', views.mapsdraw, name='mapsdraw'),
    #url(r'^maps_test/$', views.maps_test, name='maps_test'),
    #url(r'^maps_test/$', 'jsdev.views.maps_test'),
    url(r'^add/$', views.addRoutePage, name='addRoutePage'),
    url(r'^login/$', views.login, name='login'),
    #url(r'^logout/$', views.logout, name='logout'),
    #Url that ENDS with logout
    url(r'logout/$', views.logout, name='logout'),
    url(r'^loggedin/$', views.loggedin, name='loggedin'),
    url(r'^invalid/$', views.invalid, name='invalid'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^loggedin/$', views.loggedin, name='loggedin'),
    url(r'^invalid/$', views.invalid, name='invalid'),
    url(r'^register/$', views.register_user, name='register_user'),
    url(r'^register_success/$', views.register_success, name='register_success'),
    url(r'^register/$', views.register_user, name='register_user'),
    url(r'^register_success/$', views.register_success, name='register_success'),
    url(r'^signup/$', views.signupPage, name='signupPage'),
    # url(r'^addNewRoute/$', views.addRoute, name='addRoute'),
    url(r'^addNewUser/$', views.addUser, name='addUser'),
    url(r'^auth_view/$', views.auth_view, name='auth_view'),
    url(r'auth_view/$', views.auth_view, name='auth_view'),
    url(r'^save_route/$', views.save_route,name='save_route'),
    # url(r'^map_from_db/$', 'jsdev.views.get_points'),
    # url(r'^map_from_db/$', 'jsdev.views.get_points'),
    url(r'^routes/(?P<route_id>\d+)/?$',views.get_route, name='get_route'),
    url(r'^city_info',views.city_info, name='city_info'),
    url(r'^(pedestrian|car|bicycle|new|top|around|favourite)',views.getRoutes, name='getRoutes'),
    #URL to handle LIKE requests
    url(r'^routes/(?P<route_id>\d+)/like_view/$',views.like_route, name='like_route'),
)