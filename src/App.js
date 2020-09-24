import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

export default function App() {

   const api = axios.create({
      baseURL: 'http://localhost:3333'
   });

   const [segments,setSegments] = useState([]);

   const SignupSchema = Yup.object().shape({
      nome: Yup.string()
         .min(2, 'Too Short!')
         .max(50, 'Too Long!')
         .required('Required'),
      sobrenome: Yup.string()
         .min(2, 'Too Short!')
         .max(50, 'Too Long!')
         .required('Required'),
      email: Yup.string()
         .email('Invalid email')
         .required('Required'),
      segment: Yup.string().oneOf(segments.map(segment => segment.activity), 'escolha uma').required('obrigatório')
   });

   useEffect(()=> {
      api.get('/segments').then(response => {
         setSegments(response.data);
      })
   })

   function handleFormSubmit(data) {
      const { nome, sobrenome, email } = data;
      console.log(`Olá, me chamo ${nome} ${sobrenome} e meu email é ${email}`);
   }

   return (
      <>

         <h1>Signup</h1>

         <Formik

            //valores iniciais dos campos do formulário
            initialValues={{
               nome: '',
               sobrenome: '',
               email: '',
               segments: ''
            }}

            // schema de validação do Yup
            validationSchema={SignupSchema}

            // função executada quando o form é submetido
            onSubmit={handleFormSubmit}
         >

            {({ errors, touched }) => (
               <Form>

                  <Field name="nome" placeholder="Nome" />
                  {errors.nome && touched.nome ? (
                     <small style={{ color: 'red' }}>{errors.nome}</small>
                  ) : null}

                  <Field name="sobrenome" placeholder="Sobrenome" />
                  {errors.sobrenome && touched.sobrenome ? (
                     <div>{errors.sobrenome}</div>
                  ) : null}

                  <Field name="email" placeholder="Email" />
                  {errors.email && touched.email ? <div>{errors.email}</div> : null}


                  <Field as="select" name="segments">
                     <option value="">--selecione kk--</option>
                     {segments.map(segment => <option id={segment.id} value={segment.id}>{segment.activity}</option>)}           
                  </Field>

                  <button type="submit">Submit</button>

               </Form>
            )}
         </Formik>
      </>
   );
}