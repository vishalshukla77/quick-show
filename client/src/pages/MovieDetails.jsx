import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { PlayCircleIcon, StarIcon, Heart } from 'lucide-react';
import timeformat from '../lib/timeformat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard'; // ✅ Add this import
import Loading from '../components/Loading';

function MovieDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const getShow = async () => {
      const foundShow = dummyShowsData.find((s) => s._id === id);
      if (foundShow) {
        setShow({
          movie: foundShow,
          dateTime: dummyDateTimeData
        });
      } else {
        setShow(null); // Optional: Navigate to 404 page
      }
    };

    getShow();
  }, [id]);

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-12 md:pt-20'>
      {/* Movie Details Section */}
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          src={show.movie.poster_path}
          alt={show.movie.title}
          className='max-md:mx-auto rounded-xl h-[26rem] w-[17.5rem] object-cover'
        />
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top="-100px" left="-100px" />

          <p className='text-primary'>ENGLISH</p>

          <h1 className='text-4xl font-semibold max-w-96 text-balance'>
            {show.movie.title}
          </h1>

          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>
            {show.movie.overview}
          </p>

          <p className='text-gray-400 text-sm'>
            {timeformat(show.movie.runtime)} •{' '}
            {show.movie.genres.map((genre) => genre.name).join(', ')} •{' '}
            {show.movie.release_date.split("-")[0]}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm cursor-pointer bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>

            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
              Buy Tickets
            </a>

            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95' aria-label="Add to favorites">
              <Heart className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className='flex flex-col items-center text-sm'>
              <img
                className='rounded-full h-20 aspect-square object-cover'
                src={cast.profile_path}
                alt={cast.name}
              />
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <DateSelect dateTime={show.dateTime} id={id} />

      {/* Recommendation Section */}
      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} /> // ✅ Fixed typo
        ))}
      </div>

     <div className='flex justify-center mt-20'>
  <button
    onClick={() => {navigate('/movies');scrollTo(0,0)}}
    className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
  >
    Show more
  </button>
</div>

    </div>
  ) : <Loading/>
}

export default MovieDetails;
