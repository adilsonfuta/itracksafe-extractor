import { Injectable } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ItracksafeService {

     private token;
      private baseUrl = 'https://itracksafe.com/webapi';

      constructor(private readonly configservice: ConfigService){
            this.token = configservice.get('ITRACKSAFE_TOKEN');
      }

    async queryTracks(deviceId: string, start: string, end: string){
      
      const url = `${this.baseUrl}?action=querytracks&token=${this.token}`;

      //const { data } = await axios.post(url,{
      const { data } = await axios.post(url,{
        deviceid: deviceId,
        starttime: start,
        endtime: end,
        timezone: 1, // UTC+1
      })

    console.log(JSON.stringify(data, null, 2)+' \n ** GPS DATA DEVICES: ** \n');

    // const tracks = data?.records ?? [];
    const tracks = Array.isArray(data?.records) ? data.records : [];

    if(!tracks.length){
        console.log(`Nenhum track para device ${deviceId}`);
        return [];
    } 

    console.log(`Encontrados ${tracks.length} registros`);

    for(const track of tracks){
      console.log(`
      \n Track updateTime: ${track.updatetime}, 
       \n lat: ${track.callat},
       \n lon: ${track.callon},
       \n speed: ${track.speed}, 
       \n course: ${track.course}, 
       \naddress: ${track.address}`);
    }

    
     return tracks.map((item) => ({
        updateTime: item.updatetime,
        latitude: item.callat,
        longitude: item.callon,
        speed: item.speed/10, // A API retorna a velocidade em m/s, convertendo para km/h
        direction: item.course,
        address: item.address || '',
        // address: item.address;
        // A API não retorna o endereço, então deixamos vazio ou podemos implementar uma função para obter o endereço a partir das coordenadas
     }));
      
    }




}
