/* validation form */
const validate = (payload: any, setInvalidFields: any) => {
   let invalidCount = 0
   /* Convert object -> array*/
   let fields = Object.entries(payload)
   fields.forEach((item: any) => {
      if (item[1] === '' && item[0] !== 'description') {
         setInvalidFields((prev: any) => [...prev, {
            name: item[0],
            message: "Bạn không được bỏ trống trường này !"
         }])
         invalidCount++
      }
      switch (item[0]) {
         case 'password':
            if (item[1].length < 6) {
               setInvalidFields((prev: any) => [...prev, {
                  name: item[0],
                  message: 'Mật khẩu có tối thiểu 6 kí tự !'
               }])
               invalidCount++
            }
            break;
         case 'email':
            if (!validateEmail(item[1])) {
               setInvalidFields((prev: any) => [...prev, {
                  name: item[0],
                  message: 'Email không hợp lệ !'
               }])
               invalidCount++
            }
            break;
         default:
            break;
      }
   })
   return invalidCount
}

function validateEmail(mail: string) {
   if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) return (true)
   return (false)
}

export default validate