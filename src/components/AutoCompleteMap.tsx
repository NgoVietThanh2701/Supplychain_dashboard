import { useRef } from 'react';
import { useJsApiLoader, Autocomplete, LoadScriptProps, GoogleMap } from '@react-google-maps/api';
import Loading from './Loading';
import { apigetWeather } from '../services/farmerServices';
import Swal from 'sweetalert2';

/*global google*/
const libraries: LoadScriptProps['libraries'] = ['places'];

const AutoCompleteMap = ({ setPayload, label }: any) => {

   const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_APIKEY || '',
      libraries: libraries,
   });
   const inputRef = useRef<any>();

   if (!isLoaded) {
      return <Loading />
   }

   const handleLoad = () => {
      const autoComplete = new window.google.maps.places.Autocomplete(
         inputRef.current,
      )

      autoComplete.addListener('place_changed', async () => {
         const place: any = autoComplete.getPlace()
         if (!place.geometry || !place.geometry.location) {
            Swal.fire('Opps', 'Vị trí không xác định', 'error');
         }
         if (place.geometry.viewport || place.geometry.location) {
            setPayload((prev: any) => ({ ...prev, latitude: place.geometry.location.lat() }));
            setPayload((prev: any) => ({ ...prev, longitude: place.geometry.location.lng() }));
            const result = await apigetWeather(place.geometry.location.lat(), place.geometry.location.lng());
            setPayload((prev: any) => ({ ...prev, temp: result.temp }));
            setPayload((prev: any) => ({ ...prev, humidity: result.humidity }));
            setPayload((prev: any) => ({ ...prev, location: inputRef.current.value }));
         }
      })
   }

   return (
      <Autocomplete onLoad={handleLoad} className='z-20'>
         <input id='address' type='text' ref={inputRef} placeholder={label} className='outline-none border-color focus:border-[#3B71CA] border-1 text-sm text-primary py-[10px] px-2 rounded-[4px] w-full' />
      </Autocomplete>
   )
}

export default AutoCompleteMap