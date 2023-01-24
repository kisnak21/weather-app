import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
  BsCloudHazeFill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
  TbTemperatureCelsius,
  ImSpinner8,
} from 'react-icons/all';

const API = '1b0b82bb0a62e61b3dd408ab1846beb7';

const Home = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('Pontianak');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    // if input value is not empty
    if (inputValue !== '') {
      // set location
      setLocation(inputValue);
    }

    // select input
    const input = document.querySelector('input');

    // if input value is empty
    if (input.value === '') {
      // set animate to true
      setAnimate(true);
      // after 500 ms set animate to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    // clear input
    input.value = '';

    // prevent defaults
    e.preventDefault();
  };

  // fetch the data
  useEffect(() => {
    // set loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API}`;

    axios
      .get(url)
      .then((res) => {
        // set the data after 1500 ms
        setTimeout(() => {
          setData(res.data);
          // set loading to false
          setLoading(false);
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err);
      });
  }, [location]);

  // error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // if data is false show the loader
  if (!data) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-sky-600'>
        <div>
          <ImSpinner8 className='animate-spin text-5xl text-white' />
        </div>
      </div>
    );
  }

  // set the icon according to the weather
  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHazeFill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // date object
  const date = new Date();

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-sky-600 px-4 lg:px-0'>
      {errorMsg && (
        <div className='absolute top-2 z-[999] w-full max-w-[90vw] rounded-md bg-red-600 p-4 capitalize text-white lg:top-10 lg:max-w-[450px]'>{`${errorMsg.response.data.message}`}</div>
      )}
      <form
        className={`${
          animate ? 'animate-shake' : 'animate-none'
        } mb-8 h-16 w-full max-w-[450px]
      rounded-full bg-black/30 backdrop-blur-[32px]`}
      >
        <div className='relative flex h-full items-center justify-between p-2'>
          <input
            onChange={(e) => handleInput(e)}
            className='h-full flex-1 bg-transparent pl-6 text-[15px] font-light text-white outline-none placeholder:text-white'
            type='text'
            placeholder='Search by city or country'
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className='flex h-12 w-20 items-center justify-center rounded-full bg-[#1ab8ed] transition hover:bg-[#15abdd]'
          >
            <IoMdSearch className='text-2xl text-white' />
          </button>
        </div>
      </form>

      <div className='min-h-[584px] w-full max-w-[450px] rounded-[32px] bg-black/20 py-12 px-6 text-white backdrop-blur-[32px]'>
        {loading ? (
          <div className='flex h-full w-full items-center justify-center'>
            <ImSpinner8 className='animate-spin text-5xl text-white' />
          </div>
        ) : (
          <div>
            <div className='flex items-center gap-x-5'>
              <div className='text-[87px]'>{icon}</div>
              <div>
                <div className='text-2xl font-semibold'>
                  {data.name}, {data.sys.country}
                </div>

                <div>
                  {date.getUTCDate()}/{date.getUTCMonth() + 1}/
                  {date.getUTCFullYear()}
                </div>
              </div>
            </div>

            <div className='my-20'>
              <div className='flex items-center justify-center'>
                <div className='text-[144px] font-light leading-none'>
                  {parseInt(data.main.temp)}
                </div>

                <div className='text-4xl'>
                  <TbTemperatureCelsius />
                </div>
              </div>

              <div className='text-center capitalize'>
                {data.weather[0].description}
              </div>
            </div>

            <div className='mx-auto flex max-w-[378px] flex-col gap-y-6'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  {/* icon */}
                  <div className='text-[20px]'>
                    <BsEye />
                  </div>
                  <div>
                    Visibility{' '}
                    <span className='ml-2'>{data.visibility / 1000} km</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  <div className='text-[20px]'>
                    <BsThermometer />
                  </div>
                  <div className='flex'>
                    Feels like
                    <div className='ml-2 flex'>
                      {parseInt(data.main.feels_like)}
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  <div className='text-[20px]'>
                    <BsWater />
                  </div>
                  <div>
                    Humidity
                    <span className='ml-2'>{data.main.humidity} %</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  <div className='text-[20px]'>
                    <BsWind />
                  </div>
                  <div>
                    Wind <span className='ml-2'>{data.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
