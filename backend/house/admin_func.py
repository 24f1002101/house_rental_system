from .models import *
from django.shortcuts import render,redirect
from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
def registered_users(request):
    if(request.method=='GET'):
        users = User.objects.all()
        if(users.exists()):
            return render(request,'users_registered.html',{'users':users})
        else:
            return render(request,'users_registered.html',{'users':[]})
            return redirect('index')
def admin_profile(request):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            admin = Admin.objects.get(admin_id=3)
            return render(request,'admin_edit.html',{'admin':admin})
        else:
            messages.info(request,'You have to Login first !!!')
            return redirect('index')
    elif(request.method=='POST'):
        admin = Admin.objects.get(admin_id=3)
        action = request.POST.get('enter')
        if(action=='change'):
            name = request.POST.get('name')
            email = request.POST.get('email')
            print(email)
            password = request.POST.get('pass')
            if(email):
                if('@gmail.com' not in email):
                    messages.info(request,'Please enter a structered email !!!')
                    return redirect('edit_admin')
            if(name):
                if(len(name)>45):
                    messages.info(request,'Please enter you name length less than 46 !!!')
                    return redirect('edit_admin')
            if(password):
                pass_length = len(password)
                if(pass_length > 45):
                    messages.info(request,'please enter the length of password lesser than 46 !!!')
                    return redirect('edit_admin')
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
                    return redirect('edit_admin')
                for i in numbers:
                    if(i in password):
                        found1=1
                        break
                if(found1==0):
                    messages.info(request,'Please check your password . It should contain atleast one Numeric value!!!')
                    return redirect('edit_admin')
                for i in special:
                    if(i in password):
                        found2=1
                        break
                if(found2==0):
                    messages.info(request,'Please check your password . It should contain atleast one special character!!!')
                    return redirect('edit_admin')
            if(email):
                admin.admin_email = email
            if(name):
                admin.admin_name = name
            if(password):
                admin.password = password
            admin.save()
            if(email or name or password):
                messages.success(request,'Successfully changed the details of yours !!!')
            else:
                messages.info(request,'You didnot change anything in your profile !!!')
            return render(request,'admin_dashboard.html',{'admin':admin})
            
        elif(action=='Dont Change'):
            return redirect('admin_homepage')
        
def admin_logout(request):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            del request.session['admin_name']
            del request.session['admin_email']
            del request.session['admin_id']
            messages.success(request,'You have successfully logouted !!!')
            return redirect('index')
        else:
            messages.info(request,'You should login first !!!')
            return redirect('index')
        

def adding_spot(request,lot_id):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            return render(request,'add_spot.html',{'lot':lot})
        else:
            messages.info(request,'You should login first !!!')
            return render('index')
    elif(request.method=='POST'):
        address = request.POST.get('address').lower()
        rental_type = request.POST.get('room').lower()
        price = int(request.POST.get('price'))
        action = request.POST.get('action')
        lot = Rental_lot.objects.get(lot_id=lot_id)
        if(len(rental_type)>4):
            messages.info(request,'Please enter the length of room_type lesser than 5 !!!')
            return redirect('add_spot',lot_id)
        if(price<=3000):
            messages.info(request,'You should enter the price greater than 3000')
            return redirect('add_spot',lot_id)
        if(len(address)>75):
            messages.info(request,'You should enter the length of address lesser than 76 !!!')
            return redirect('add_spot',lot_id)
        if(action == 'dont'):
            return redirect('expand_lot',lot_id)
        elif(action=='Add'):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            if(rental_type=='1bhk' or rental_type=='2bhk' or rental_type=='3bhk'):
                if(lot.location.lower() != address and lot.location.lower() in address):
                    new_spot = Rental_spot(
                        lot=lot,
                        status='A',
                        price=price,
                        address=address,
                        location=lot.location.lower(),
                        type=rental_type
                    )
                    new_spot.save()
                    return redirect('expand_lot',lot_id)
                else:
                    messages.info(request,'Please enter valid address !!!')
                    return redirect('add_spot',lot_id)
            else:
                messages.info(request,'You should enter only 1bhk or 2bhk or 3bhk !!!')
                return redirect('add_spot',lot_id)
            

def addlot(request):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            return render(request,'add_lot.html')
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
    elif(request.method=='POST'):
        lots = Rental_lot.objects.all()
        found1=0
        found2=0
        location = request.POST.get('location')
        pincode = request.POST.get('pin')
        print(pincode)
        for i in lots:
            if(i.location==location):
                found1=1
                break
        for i in lots:
            if(int(i.pincode)==int(pincode)):
                found2=1
                break
        if(len(location)>50):
            messages.info(request,'You must enter the location name length lesser than 51 !!!')
            return redirect('adding_lot')
        if(len(pincode)>6):
            messages.info(request,'You must enter the length of pincode lesser than 7 !!!')
            return redirect('adding_lot')
        if(found1==1):
            messages.info(request,'Entered location already existed . Try new one !!!')
            return redirect('adding_lot')
        if(found2==1):
            messages.info(request,'Entered pincode aready existed . Try new one !!!')
            return redirect('adding_lot')
        new_lot = Rental_lot(location=location,pincode=int(pincode))
        new_lot.save()
        return redirect('admin_homepage')

def expand_lot(request,lot_id):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            spots = lot.rental_spot_set.all()
            return render(request,'expand.html',{'spots':spots,'lot':lot})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
        
def delete_lot(request,lot_id):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            spots = lot.rental_spot_set.all()
            occupied= 0
            for i in spots:
                if(i.status=='O'):
                    occupied+=1
            if(occupied==0):
                lot.delete()
                messages.success(request,'Successfully deleted the lot !!!')
                return redirect('admin_homepage')
            else:
                messages.info(request,'Cannot delete the lot because it is occupied !!!')
                return redirect('admin_homepage')
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
        
def edit_spot(request,lot_id,spot_id):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            editing_spot = Rental_spot.objects.get(spot_id=spot_id,lot = lot)
            return render(request,'edit_spot.html',{'lot':lot,'spot':editing_spot})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
    elif(request.method=='POST'):
        address = request.POST.get('address').lower()
        rental_type = request.POST.get('room').lower()
        price = request.POST.get('price')
        action = request.POST.get('action')
        lot = Rental_lot.objects.get(lot_id=lot_id)
        editing_spot = Rental_spot.objects.get(spot_id=spot_id,lot=lot)
        if(action == 'dont'):
            messages.info(request,'You didnot change any thing in lot '+str(lot_id)+' with spot '+str(spot_id))
            return redirect('expand_lot',lot_id)
        elif(action=='change'):
            if(rental_type):
                if(len(rental_type)>4):
                    messages.info(request,'Please enter the length of room_type lesser than 5 !!!')
                    return redirect('edit_spot',lot_id,spot_id)
                else:
                    if(rental_type=='1bhk' or rental_type=='2bhk' or rental_type=='3bhk'):
                        editing_spot.type=rental_type
                    else:
                        messages.info(request,'Please enter type as 1bhk or 2bhk or 3bhk !!!')
                        return redirect('edit_spot',lot_id,spot_id)
            if(price):
                if(int(price) <= 3000):
                    messages.info(request,'You should enter the price greater than 3000 !!!')
                    return redirect('edit_spot',lot_id,spot_id)
                else:
                    editing_spot.price = int(price)
            if(address):
                if(len(address)>75):
                    messages.info(request,'You should enter the length of address lesser than 76 !!!')
                    return redirect('edit_spot',lot_id,spot_id)
                else:
                    if(lot.location.lower() != address and lot.location.lower() in address):
                        editing_spot.address = address
                    else:
                        messages.info(request,'Please enter a valid address to edit !!!')
                        return redirect('edit_spot',lot_id,spot_id)
            messages.info(request,'Successfully changed the details of the lot '+str(lot_id)+' which has spot '+str(spot_id))
            editing_spot.save()
            return redirect('expand_lot',lot_id)
        

def view_spot(request,lot_id,spot_id):
    if(request.method=='GET'):
        lot = Rental_lot.objects.get(lot_id=lot_id)
        spot = Rental_spot.objects.get(spot_id=spot_id)
        booked = Registered_spot.objects.get(lot=lot,spot=spot,leaving_time=None)
        amount = booked.spot.price/30
        registered = booked.registered_time
        present = timezone.now() - registered
        total = present.days*amount
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            return render(request,'booked.html',{'booked':booked,'total':total})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
    elif(request.method=='POST'):
        action=request.POST.get('action')
        if(action=='close'):
            print(lot_id)
            print(spot_id)
            return redirect('expand_lot',lot_id)
        
def delete_spot(request,lot_id,spot_id):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lot = Rental_lot.objects.get(lot_id=lot_id)
            spot = Rental_spot.objects.get(spot_id=spot_id,lot=lot)
            spot.delete()
            return redirect('expand_lot',lot_id)
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
        
def admin_search(request):
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
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            return render(request,'admin_search.html',{'lotspots':lot_spots})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('index')
    elif(request.method=='POST'):
        parameter = request.POST.get('parameter')
        value = request.POST.get('value')
        if(parameter=='user_id'):
            if(value and value.isdigit()):
                try:
                    user = User.objects.get(user_id=int(value))
                    registered = Registered_spot.objects.filter(user=user,leaving_time=None)
                    lot_spots=[]
                    visited={}
                    for i in registered:
                        lot  = Rental_lot.objects.get(lot_id=i.lot.lot_id)
                        if(lot not in visited):
                            lot_spot = []
                            spot = lot.rental_spot_set.all()
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
                            lot_spots.append((i.lot,lot_spot,available,total,occupied))
                        else:
                            visited.add(i)
                    return render(request,'admin_search.html',{'lotspots':lot_spots})
                except User.DoesNotExist:
                    messages.info(request,'entered user doesnot exist . Please enter another user id !!!')
                    return render(request,'admin_search.html',{'lotspots':lot_spots})
            else:
                messages.info(request,'Please enter a valid user id !!!')
                return render(request,'admin_search.html',{'lotspots':lot_spots})
        elif(parameter=='location'):
            lots = Rental_lot.objects.all()
            result=[]
            if(value and value.isalpha()):
                for i in lots:
                    if(value.lower() in i.location.lower()):
                        result.append(i)
                lot_spot=[]
                for i in result:
                    spot = i.rental_spot_set.all()
                    lot_spot_ = []
                    available = 0
                    total=0
                    occupied=0
                    for j in spot:
                        if(j.status=='A'):
                            available+=1
                        elif(j.status=='O'):
                            occupied+=1
                        total+=1
                        lot_spot_.append(j)
                    lot_spot.append((i,lot_spot_,available,total,occupied))
                if(lot_spot):  
                    return render(request,'admin_search.html',{'lotspots':lot_spot})
                else:   
                    messages.info(request,'Entered location doesnot exists !!! Please enter another location ')
                    return render(request,'admin_search.html',{'lotspots':lot_spots})
            else:
                messages.info(request,'Please enter valid location !!!')
                return render(request,'admin_search.html',{'lotspots':lot_spots})
            
        elif(parameter=='pincode'):
            if(value and value.isdigit()):
                result=[]
                for i in lots:
                    if(value in i.pincode):
                        result.append(i)
                lot_spot=[]
                for i in result:
                    spot = i.rental_spot_set.all()
                    lot_spot_ = []
                    available = 0
                    total=0
                    occupied=0
                    for j in spot:
                        if(j.status=='A'):
                            available+=1
                        elif(j.status=='O'):
                            occupied+=1
                        total+=1
                        lot_spot_.append(j)
                    lot_spot.append((i,lot_spot_,available,total,occupied))
                if(lot_spot):  
                    return render(request,'admin_search.html',{'lotspots':lot_spot})
                else:   
                    messages.info(request,'Entered Pincode doesnot exists !!! Please enter another Pincode ')
                    return render(request,'admin_search.html',{'lotspots':lot_spots})

            else:
                messages.info(request,'Please enter valid Pincode !!!')
                return render(request,'admin_search.html',{'lotspots':lot_spots})
            
def summary(request):
    if(request.method=='GET'):
        if('admin_name' in request.session and 'admin_email' in request.session and 'admin_id' in request.session):
            lots = Rental_lot.objects.all()
            result=[]
            for i in lots:
                spot = i.rental_spot_set.all()
                total=0
                available=0
                occupied = 0
                for j in spot:
                    if(j.status=='A'):
                        available+=1
                    elif(j.status=='O'):
                        occupied+=1
                    total+=1
                using = Registered_spot.objects.filter(lot=i,leaving_time__isnull=True)
                used = Registered_spot.objects.filter(lot=i,leaving_time__isnull=False)
                registered = Registered_spot.objects.filter(lot=i)
                total_cost = 0
                total_days = 0
                for j in registered:
                    if(j.leaving_time):
                        time = j.leaving_time - j.registered_time
                        days = time.days
                        total_days+=days
                        cost = (j.spot.price/30)*days
                        total_cost+=cost
                    else:
                        time = timezone.now() - j.registered_time
                        days = time.days
                        total_days+=days
                        cost = (j.spot.price/30)*days
                        total_cost+=cost
                result.append((i,total,available,occupied,total_days,total_cost,len(using),len(used)))
            return render(request,'summary.html',{'result':result})

