import { useEffect, useState } from 'react';
import RoomSong from '../../models/RoomSong';
import Song from '../../models/Song';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useSongs = (ids: number[]) => {
  const [dictionary, setDictionary] = useState<Dictionary<Song>>({});

  const table = 'songs';
  const whereColumn = 'id';

  useEffect(() => {
    console.log('Songs Initial');

    // Fetch initial data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .in(whereColumn, ids);

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
  }, [ids]);

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
            if (!ids.includes(payload.new[whereColumn])) return;

            setDictionary((d) => {
              return {
                ...d,
                [payload.new['id']]: payload.new,
              };
            });
            return;
          case 'DELETE':
            if (!ids.includes(payload.old[whereColumn])) return;

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
  }, [ids]);

  const array = Object.values(dictionary);
  return { dictionary, array };
};

export default useSongs;
