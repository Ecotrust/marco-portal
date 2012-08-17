from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.utils import add_postgis_srs

class Command(BaseCommand):
    args = '<srid>'
    help = 'Add Custom SRID'

    def handle(self, *args, **options):
        srid = args[0]
        try:
            add_postgis_srs(srid)
        except:
            raise CommandError('Problem adding SRID: %s' % srid)


        self.stdout.write('Successfully added SRID "%s"' % srid)