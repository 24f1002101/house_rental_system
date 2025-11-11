from django.shortcuts import render , redirect
from .models import *
from django.core.exceptions import ObjectDoesNotExist
from django.contrib import messages

def index(request):
    if(request.method=='GET'):
        return render(request,'admin_login.html')

    elif(request.method=='POST'):
        email = request.POST.get('email')
        if('@gmail.com' not in email):
            messages.error(request,'Entered email is not in correct structure !!!')
            return redirect('index')
        password = request.POST.get('password')
        admin = Admin.objects.get(admin_id=3)
        real_email = admin.admin_email
        real_password = admin.password
        try:
            logged = Admin.objects.get(admin_email = email,password = password)
        except Admin.DoesNotExist:
            if(password!=real_password and email!=real_email):
                messages.error(request,'Please enter valid email and password !!!')
                return redirect('index')
            elif(password != real_password):
                messages.error(request,'Please enter valid password to login !!!')
                return redirect('index')
            elif(email != real_email):
                messages.error(request,'Please enter valid email to login !!!')
                return redirect('index')
        request.session['admin_name'] = logged.admin_name
        request.session['admin_email'] = logged.admin_email
        request.session['admin_id'] = logged.admin_id
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            return redirect('admin_homepage')

def user_index(request):
    if(request.method=='GET'):
        return render(request,'user_login.html')
    elif(request.method=='POST'):
        email = request.POST.get('email')
        if('@gmail.com' not in email):
            messages.error(request,'Please enter a structured email id !!!')
            return redirect('user_index')
        password = request.POST.get('password')
        try:
            user = User.objects.get(user_email=email)
            users = User.objects.all()
            count=0
            for i in users:
                if(i==user):
                    break
                count+=1
            if(password!=user.password):
                messages.info(request,'Please enter password correctly !!!')
                return redirect('user_index')
            else:
                request.session['user_id'+str(count)] = user.user_id
                request.session['user_email'+str(count)] = user.user_email
                request.session['user_password'+str(count)] = user.password
                if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
                    return redirect('user_homepage',user.user_id)
        except User.DoesNotExist:
            messages.info(request,'You have to register first !!!')
            return render(request,'user_registration.html')
        
def user_register(request):
    if(request.method=='GET'):
        return render(request,'user_registration.html')
    elif(request.method=='POST'):
        name = request.POST.get('uname')
        name_length = len(name)
        email = request.POST.get('email')
        if('@gmail.com' not in email):
            messages.error(request,'Please enter the well structured email id !!!')
            return redirect('registration')
        if(name_length > 45):
            messages.info(request,'Please enter the length of name lesser than 46 !!!')
            return redirect('registration')
        password = request.POST.get('pass')
        upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        numbers = '1234567890'
        special='@_!#$%^&*()_+{|}?/.><,:;~`='
        found=0
        found1=0
        found2=0
        for i in upper:
            if(i in password):
                found=1
                break
        if(found==0):
            messages.info(request,'Please check your password . It should contain atleast one Capital letter !!!')
            return redirect('registration')
        for i in numbers:
            if(i in password):
                found1=1
                break
        if(found1==0):
            messages.info(request,'Please check your password . It should contain atleast one Numeric value!!!')
            return redirect('registration')
        for i in special:
            if(i in password):
                found2=1
                break
        if(found2==0):
            messages.info(request,'Please check your password . It should contain atleast one special character!!!')
            return redirect('registration')
        pass_length = len(password)
        if(pass_length > 45):
            messages.info(request,'please enter the length of password lesser than 46 !!!')
            return redirect('registration')
        address = request.POST.get('address')
        address_length = len(address)
        if(address_length > 75):
            messages.info(request,'please enter the length of address lesser than 76 !!!')
            return redirect('registration')
        pincode = request.POST.get('pin')
        pincode_length = len(pincode)
        if(pincode_length > 6):
            messages.info(request,'please enter the length of pincode lesser than 7 !!!')
            return redirect('registration')
        new_user = User(user_email=email,password=password,name=name,address=address,pincode=int(pincode))
        new_user.save()
        messages.success(request,'Successfully Registered !!!')
        return redirect('user_index')

def role(request):
    if(request.method=='GET'):
        return render(request,'role.html')
    elif(request.method=='POST'):
        role = request.POST.get('role')
        if(role=='User'):
            return redirect('user_index')
        elif(role=='Admin'):
            return redirect('index')
        
def admin_homepage(request):
    if(request.method=='GET'):
        admin =  Admin.objects.get(admin_id=1)
        lots = Rental_lot.objects.all()
        lot_spots = []
        for i in lots:
            spot = i.rental_spot_set.all()
            lot_spot = []
            available = 0
            total=0
            occupied=0
            for j in spot:
                if(j.status=='A'):
                    available+=1
                elif(j.status=='O'):
                    occupied+=1
                total+=1
                lot_spot.append(j)
            lot_spots.append((i,lot_spot,available,total,occupied))
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            return render(request,'admin_dashboard.html',{'admin':admin,'lotspots':lot_spots})
        else:
            messages.info(request,'You must login First !!!')
            return redirect('index')
        
def user_homepage(request,user_id):
    if(request.method=='GET'):
        lots = Rental_lot.objects.all()
        users = User.objects.all()
        user = User.objects.get(user_id=user_id)
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        result=[]
        for i in lots :
            spots = i.rental_spot_set.all()
            spot= []
            for j in spots:
                if(j.status=='A'):
                    spot.append(j)
            result.append((i,spot))
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        print(result)
        for i in result:
            for j in i[1]:
                print(j.price,j.address,j.type)
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'user_dashboard.html',{'user':user,'result':result})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')