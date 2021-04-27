import { useEffect, useState } from 'react';
import Room from '../../models/Room';
import RoomSong from '../../models/RoomSong';
import Song from '../../models/Song';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useSongs = (roomID: number) => {
  const [dictionary, setDictionary] = useState<Dictionary<Song>>({});

  const table = 'songs';
  const whereColumn = 'room_id';

  useEffect(() => {
    if (roomID < 0) return;

    console.log('Songs Initial');

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
          dict[element['id']] = element;
          return dict;
        }, {});

        setDictionary(updatedDictionary);
      }
    };

    fetchData();
  }, [roomID]);

  useEffect(() => {
    console.log('Songs Subscription');

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

            // ==== LOGIC FOR MULTIPLE SONGS ====
            // setDictionary((d) => {
            //   return {
            //     ...d,
            //     [payload.new['id']]: payload.new,
            //   };
            // });

            // ==== LOGIC FOR SINGLE SONG ====
            setDictionary((d) => {
              return {
                [payload.new['id']]: payload.new,
              };
            });
            return;
          case 'DELETE':
            if (payload.new[whereColumn] !== roomID) return;

            setDictionary((d) => {
              delete d[payload.old['id']];
              return { ...d };
            });
            return;
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const array = Object.values(dictionary);
  return { dictionary, array };
};

export default useSongs;
