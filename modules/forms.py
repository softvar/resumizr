'''
Collection of forms used in resumizr

'''

from django import forms

class RegisterationForm(forms.Form):
	''' user registration form for resumizr '''
	username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'your username','id' : 'username'}))
	email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': 'you@example.com', 'id': 'email'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'id':'password'}),required=True, min_length=6)



class LoginForm(forms.Form):
	''' user login form for resumizr '''
	username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'your username','id' : 'username'}))
	password = forms.CharField(widget=forms.PasswordInput(attrs={'id':'password'}),required=True, min_length=6)


