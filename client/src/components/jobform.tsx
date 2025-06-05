// import react's useStat hook for managing form state
import React, { useState } from 'react';
 //import supabase client to interact with the database
import { supabase } from '../supabaseClient';


//define a functional component that recieves the logged-in user as a prop
export default function jobForm({ user }: { user: any }) {
    // state for input fields: company name, role and status
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Applied'); // default status option

    //state to handle form success or error messages
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    //function to handle form submition 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // prevent default form page reload

        // insert the new job application into the 'jobs' table in the database
        const { data, error } = await supabase
            .from('jobs')
            .insert([
                {
                    company_name: companyName,
                    role: role,
                    status: status,
                    user_id: user.id, // associate the job with the logged-in user
                },
            ]);

        // handle errors or success messages
        if (error) {
            setError(error.message);
            setSuccess(null);
        } else {
            setSuccess('Job application added successfully!');
            setError(null);
            // reset form fields after successful submission
            setCompanyName('');
            setRole('');
            setStatus('Applied');
        }
    };
}