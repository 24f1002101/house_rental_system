from .models import *
from django.shortcuts import render , redirect
from django.contrib import messages
from django.utils import timezone
def edit_profile(request,user_id):
    user = User.objects.get(user_id=user_id)
    users = User.objects.all()
    count=0
    for i in users:
        if(i==user):
            break
        count+=1
    if(request.method=='GET'):
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'edit_profile.html',{'user':user})
        else:
            messages.info(request,'You must Login first !!!')
            return redirect('user_index')
    elif(request.method=='POST'):
        name = request.POST.get('name')
        email = request.POST.get('email')
        address = request.POST.get('address')
        pincode = request.POST.get('pin')
        action = request.POST.get('action')
        if(action=='dont'):
            messages.info(request,'You have not changed any thing in your profile !!!')
            return redirect('user_homepage',user_id)
        elif(action=='change'):
            if(name):
                if(len(name)>45):
                    messages.info(request,'Please enter length of name lesser than 46 !!!')
                    return redirect('edit_profile',user_id)
                else:
                    user.name = name
            if(email):
                if('@gmail.com' in email):
                    user.user_email = email
                else:
                    messages.info(request,'Please enter valid structured email !!!')
                    return redirect('edit_profile',user_id)
            if(address):
                if(len(address)>75):
                    messages.info(request,'Please enter the length of address lesser than 76 !!!')
                    return redirect('edit_profile',user_id)
                else:
                    user.address = address
            if(pincode):
                if(len(pincode)>6):
                    messages.info(request,'Please enter the length of pincode lesser than 7 !!!')
                    return redirect('edit_profile',user_id)
                else:
                    user.pincode = int(pincode)
            user.save()
            messages.success(request,'Successfully updated your deatils !!!')
            return redirect('user_homepage',user_id)
        
def user_logout(request,user_id):
    if(request.method=='GET'):
        users = User.objects.all()
        user = User.objects.get(user_id=user_id)
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            del request.session['user_id'+str(count)]
            del request.session['user_email'+str(count)]
            del request.session['user_password'+str(count)]
            messages.info(request,'You have successfully logouted !!!')
            return redirect('user_index')
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')
        
def book_spot(request,lot_id,spot_id,user_id):
    user = User.objects.get(user_id=user_id)
    if(request.method=='GET'):
        users = User.objects.all()
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'book_spot.html',{'lot_id':lot_id ,'spot_id':spot_id ,'user_id':user_id})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')
    elif(request.method=='POST'):
        lot = Rental_lot.objects.get(lot_id=lot_id)
        spot = Rental_spot.objects.get(spot_id=spot_id,lot=lot)  
        phone = request.POST.get('phone')
        action = request.POST.get('action')
        if(action=='reserve'):
            if(phone):
                if(len(phone)>10):
                    messages.info(request,'Please enter the length of phone number lesser than 11 !!!')
                    return redirect('book_spot',lot_id,spot_id,user_id)
                else:
                    new_registered = Registered_spot(
                        lot = lot,
                        spot = spot,
                        user = user,
                        phone_number = int(phone)
                    )
            else:
                messages.info(request,'Please enter your phone number to book the spot !!!')
                return redirect('book_spot',lot_id,spot_id,user_id)
            new_registered.save()
            spot.status='O'
            spot.save()
            messages.info(request,'Successfully booked the spot !!!')
            return redirect('user_homepage',user_id)
        elif(action=='cancel'):
            messages.info(request,'You didnot book the particlar spot !!!')
            return redirect('user_homepage',user_id)
        
def user_history(request,user_id):
    if(request.method=='GET'):
        users = User.objects.all()
        count=0
        user = User.objects.get(user_id=user_id)
        for i in users:
            if(i==user):
                break
            count+=1
        history=Registered_spot.objects.filter(user_id=user_id)
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'history.html',{'history':history})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')
        
def release_spot(request,lot_id,spot_id,user_id):
    spot = Rental_spot.objects.get(spot_id=spot_id)
    lot = Rental_lot.objects.get(lot_id=lot_id)
    user = User.objects.get(user_id=user_id)
    if(request.method=='GET'):
        users = User.objects.all()
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        history=Registered_spot.objects.get(lot=lot,spot=spot,user=user,leaving_time=None)
        present_time = timezone.now()
        diff = present_time - history.registered_time
        amount = int(spot.price/30)
        print(diff.days,amount)
        total = diff.days*amount
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'release.html',{'history':history,'present_time':present_time,'total':total})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')
    elif(request.method=='POST'):
        action = request.POST.get('action')
        if(action=='Release'):
            booked = Registered_spot.objects.get(lot=lot,spot=spot,user=user,leaving_time=None)
            booked.leaving_time = timezone.now()
            spot.status='A'
            spot.save()
            booked.save()
            messages.info(request,'Successfully released the spot !!!')
            return redirect('user_history',user_id)
        elif(action=='Cancel'):
            return redirect('user_history',user_id)
        
def user_summary(request,user_id):
    if(request.method=='GET'):
        user = User.objects.get(user_id=user_id)
        users = User.objects.all()
        count=0
        for i in users:
            if(i==user):
                break
            count+=1
        history=Registered_spot.objects.filter(user=user,leaving_time__isnull=False)
        result = []
        for i in history:
            time = i.leaving_time - i.registered_time
            amount = int(i.spot.price/30)
            diff = time.days
            total = diff*amount
            result.append((i,total,diff))
        if('user_id'+str(count) in request.session and 'user_email'+str(count) in request.session and 'user_password'+str(count) in request.session):
            return render(request,'user_summary.html',{'result':result})
        else:
            messages.info(request,'You must login first !!!')
            return redirect('user_index')
