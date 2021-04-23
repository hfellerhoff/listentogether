import React, { useEffect, useState } from 'react';
import supabase from '../../util/supabase';

interface Dictionary<T> {
  [id: string]: T;
}

const useSupabaseSubscription = <T extends unknown>(
  table: string,
  primaryKeyColumn: string,
  where?: {
    column: string;
    value: any;
  }
) => {
  const [dictionary, setDictionary] = useState<Dictionary<T>>({});

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      // If there is a database filter, apply that filter
      const { data, error } = where
        ? await supabase.from(table).select('*')
        : await supabase.from(table).select('*').eq(where.column, where.value);

      if (error) console.log('error', error);
      else {
        let updatedDictionary = {};
        data.forEach((element) => {
          updatedDictionary[element[primaryKeyColumn]] = element;
        });

        setDictionary(updatedDictionary);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Subscribe to future table changes
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        console.log(`=== TABLE (${table}) ${payload.eventType} ===`);

        // Apply filters
        if (where) {
          if (
            payload.eventType === 'INSERT' ||
            payload.eventType === 'UPDATE'
          ) {
            if (payload.new[where.column] !== where.value) return;
          }
          if (payload.eventType === 'DELETE') {
            if (payload.old[where.column] !== where.value) return;
          }
        }

        // Update data
        switch (payload.eventType) {
          case 'INSERT':
          case 'UPDATE':
            setDictionary((d) => {
              return {
                ...d,
                [payload.new[primaryKeyColumn]]: payload.new,
              };
            });
            return;
          case 'DELETE':
            setDictionary((d) => {
              delete d[payload.old[primaryKeyColumn]];
              return { ...d };
            });
            return;
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, primaryKeyColumn, where, setDictionary]);

  return { dictionary, array: Object.values(dictionary) };
};

export default useSupabaseSubscription;
