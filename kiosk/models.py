from django.db import models

class Result(models.Model):
    """A user's result in the crank kiosk."""
    identifier = models.CharField(max_length=5)
    graphic = models.ImageField(upload_to='uploads', blank=True, null=True)
    average_power = models.DecimalField(max_digits=6, decimal_places=2)
    energy = models.DecimalField(max_digits=6, decimal_places=2)
    creation_time = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.identifier


class SolarReading(models.Model):
    """A single solar panel power reading at a given time."""
    power = models.DecimalField(max_digits=6, decimal_places=2)
    read_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('read_time',)
