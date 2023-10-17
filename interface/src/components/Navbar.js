import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="flex items-center justify-between w-full h-20 px-6 border-b-2 border-[#2362C0] text-white bg-[#2362C0]">
            <Link className="flex flex-row items-center space-x-2" to='/'>
                <img src="https://www.hyperlane.xyz/_next/static/media/logo-image.57d67522.svg" className="w-10 h-10" alt=""/>
                <div className="font-semibold md:text-3xl text-2xl" to='/'>Hyperfuel</div>
            </Link>
            <div className="space-x-8 sm:space-x-24 md:space-x-40 lg:space-x-72">
                <Link className="font-semibold hover:underline decoration-[#D631B9]" to='/'>Refill</Link>
                <Link className="font-semibold hover:underline decoration-[#D631B9]" to='/dashboard'>Earn</Link>
                {/* <Link className="font-normal hover:font-bold text-md" to='/earn'>Earn</Link>  */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar"/>
            </div>
        </div>
    )
}

export default Navbar;