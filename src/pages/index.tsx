import Image from 'next/image'
import {Inter} from 'next/font/google'
import {useEffect, useState} from "react";
import {getRandomNumber} from "@/utils/utils";

const inter = Inter({subsets: ['latin']})

export default function Home() {
    const defaultList = [
        {
            value: 'A',
            id: 'A'
        },
        {
            value: 'B',
            id: 'B'
        },
        {
            value: 'C',
            id: 'C'
        },
        {
            value: 'D',
            id: 'D'
        },
        {
            value: 'E',
            id: 'E'
        },
    ];
    const [list, setList] = useState([...defaultList]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(setTimeout(() => {
    }));

    function search() {
        if (!searchTerm) {
            setSearchResults([...defaultList]);

            return;
        }

        fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => setSearchResults(
                data.results.filter(({collectionName}) => collectionName)
                    .map(({collectionName, collectionId}) => ({value: collectionName, id: `${collectionId}-${getRandomNumber(1000,9999)}`}))
                    .sort(({value: a}, {value: b}) => a.localeCompare(b))
                    .slice(0, 5)
            ))
            .catch(console.error);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setList(prevList => [...prevList.slice(1), prevList[0]]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (searching) {
            clearTimeout(searching);
        }

        setSearching(setTimeout(search, 700));

        return () => {
            if (!searching) {
                return
            }

            clearTimeout(searching);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (!searchResults.length) {
            return;
        }

        setList([...searchResults]);
    }, [searchResults]);

    const handleSearchChange = ({target: {value}}) => setSearchTerm(value);

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <div
                className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                <Image
                    className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                    src="/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
            </div>

            <div className="my-auto w-72 flex flex-col">
                <input type="text"
                       onKeyUp={handleSearchChange}
                       className="bg-gray-500 py-2 px-3 outline-0 rounded-t-lg"/>

                <div className="w-full">
                    <ul className="w-full rounded-b-lg overflow-hidden">
                        {list.map(({id, value}) => (<li key={id} className="text-center w-full py-2 px-3 bg-gray-700 border-b border-gray-500">{value}</li>))}
                    </ul>
                </div>
            </div>
        </main>
    )
}
