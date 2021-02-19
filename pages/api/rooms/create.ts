const redirectURI =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/rooms/'
    : 'http://listentogether.app/rooms/';

import supabase from '../../../util/supabase/index';

export default function handler(req, res) {
  const roomID = 0;
  console.log(req.body)
  // supabase
  // .from('rooms')
  // .insert([
  //   {owner: "", name: "test", isPublic: true}
  // ])
  //         supabase
  //           .from('users')
  //           .select("*")
            
  //           .eq('serviceId', user.serviceId).then((res_2) =>{
  //               console.log("RES_2, array: ");
  //               console.log(res_2);
  //               if (res_2.data.length === 0){
  //                 supabase
  //                     .from('users')
  //                     .insert([
  //                       user,
  //                     ]).then((res_1) => {
  //                       console.log("RES 1: ")
  //                       console.log(res_1)
  //                     })
  //                 // console.log(supabase)

  //               }
  //           } );
          


  res.redirect(redirectURI + roomID);
}
