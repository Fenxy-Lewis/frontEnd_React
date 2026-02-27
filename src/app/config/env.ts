
const requireEnv =(key:string)=>{
    const v = import.meta.env[key];
    console.log(`Environment variable ${key}:`, v);
    if(!v){
        throw new Error(`Environment variable ${key} is required but not defined.`);
        // console.error(`Environment variable ${key} is required but not defined.`);
    }
    return v as string;
};
export const ENV ={
    API_URL: requireEnv("VITE_API_URL"),
} as const;