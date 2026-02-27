import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from "@/components/ui/button.tsx";

const Home: React.FC = () => {
    return (
        <div>
            <Link to="/product">
                <Button>Product Page</Button>
            </Link>
            <h1>Welcome to Home Page</h1>
            <p>សូមស្វាគមន៍មកកាន់ទំព័រដើម!</p>
        </div>
    );
};

export default Home;