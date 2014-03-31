from django import template

register = template.Library()

@register.filter
def mysplit(value, sep = "."):
    return value.split(sep)
   