

    /**
     * 
await this.exportByDateRange(
  devices,
  new Date(),
  new Date(),
);
*/
    //"start:dev": "nest start --watch",
     //"start:prod": "node dist/main",
    //"dev": "nest start --watch",

       // await this.exportservice.exportDaily(this.devices);
      //  await this.exportservice.exportByDateRange(deviceIds, new Date('2026-03-07'), new Date('2026-03-08'));
      // console.log(`${this.itrackDateSart} ===  ${this.itrackDateEnd}`);


      /**

    return tracks.map((item) => ({
      updateTime: item.updatetime,
      latitude: item.callat,
      longitude: item.callon,
      speed: item.speed / 10, // A API retorna a velocidade em m/s, convertendo para km/h
      direction: item.course,
      address: item.address || '',
      // address: item.address;
      // A API não retorna o endereço, então deixamos vazio ou podemos implementar uma função para obter o endereço a partir das coordenadas
    }));


 */
    for (const track of tracks) {
      console.log(`
      \n Track updateTime: ${track.updatetime}, 
       \n lat: ${track.callat},
       \n lon: ${track.callon},
       \n speed: ${track.speed}, 
       \n course: ${track.course}, 
       \naddress: ${track.address}`);
    }

                    header2: [
                    { id: 'deviceid', title: 'deviceid' },
                    { id: 'datetime', title: 'datetime' },
                    { id: 'latitude', title: 'latitude' },
                    { id: 'longitude', title: 'longitude' },
                    { id: 'speed_kmh', title: 'speed_kmh' },
                    { id: 'course_deg', title: 'course_deg' },
                    { id: 'status', title: 'status' },
                    { id: 'distance_m', title: 'distance_m' },
                    { id: 'altitude_m', title: 'altitude_m' },
                    { id: 'positioning', title: 'positioning' },
                    { id: 'alarm', title: 'alarm' },
                    { id: 'track_points', title: 'track_points' },
                    { id: 'starttime', title: 'starttime' },
                      { id: 'endtime', title: 'endtime' },
                ]

    /*


        return tracks.map((item) => ({
      deviceid: deviceId,
      datetime: item.updatetime,
      latitude: item.callat,
      longitude: item.callon,
      speed_kmh: item.speed / 10, // converter km/h
      course_deg: item.course,

      status: item.strstatusen,
      distance_m: '',
      altitude_m: '',
      positioning: item.gotsrc,
      alarm: item.stralarmen ?? '',
      track_points: '',
      startime: item.starttime,
      endtime: item.endtime,
      
    }));



        @Cron('*/15 * * * *')
    async handleDailyExport() {
        try {
            const allDevices = this.deviceservice.getAll();
            const deviceIds = allDevices.map(d => d.deviceid);
            this.logger.log('\n Extraction Started \n');
            await this.exportservice.exportByDateRange(deviceIds, new Date(this.itrackDateSart), new Date(this.itrackDateEnd));
            this.logger.log('\n Extraction finished \n');

        } catch (error) {
            this.logger.error(`\n Export Failed: ${error.stack} \n`);
        }

    }


    /*  
//private devices = ["6038131591","6038131650","6038132052","6038078555","6038052969"];
    private loadDevices():Device[]{
        const filePath = path.join(process.cwd(),'src','devices','devices.json');
        const raw = fs.readFileSync(filePath,'utf-8');
        return JSON.parse(raw);
      }
*/ 