import { useEffect, useState } from 'react';
import RoomSong from '../../models/RoomSong';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useRoomSongs = (roomID: number) => {
  const [dictionary, setDictionary] = useState<Dictionary<RoomSong>>({});

  const table = 'room_song';
  const whereColumn = 'song_id';

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(whereColumn, roomID);

      if (error) console.log('error', error);
      else {
        // Create dictionary out of array
        const updatedDictionary = data.reduce((dict, element) => {
          dict[element['song_id']] = element;
          return dict;
        }, {});

        setDictionary(updatedDictionary);
      }
    };

    fetchData();
  }, [roomID]);

  useEffect(() => {
    // Subscribe to future table changes
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        console.log(`=== TABLE (${table}) ${payload.eventType} ===`);

        // Update data
        switch (payload.eventType) {
          case 'INSERT':
          case 'UPDATE':
            if (payload.new[whereColumn] !== roomID) return;

            setDictionary((d) => {
              return {
                ...d,
                [payload.new['song_id']]: payload.new,
              };
            });
            return;
          case 'DELETE':
            if (payload.old[whereColumn] !== roomID) return;

            setDictionary((d) => {
              delete d[payload.old['song_id']];
              return { ...d };
            });
            return;
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomID]);

  const array = Object.values(dictionary);
  return { dictionary, array };
};

export default useRoomSongs;
