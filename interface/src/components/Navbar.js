import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="flex items-center justify-between w-full h-20 px-6 border-b-2 border-[#2362C0] text-white bg-[#2362C0]">
            <Link className="flex flex-row items-center space-x-2" to='/'>
                <img src="https://www.hyperlane.xyz/_next/static/media/logo-image.57d67522.svg" className="w-14 h-14" alt=""/>
                <div className="font-semibold text-4xl" to='/'>Hyperfuel</div>
            </Link>
            <div className="space-x-36 text-xl">
                <Link className="font-semibold hover:border-b-4 border-[#D631B9]" to='/bridge'>Bridge</Link>
                <Link className="font-semibold hover:border-b-4 border-[#D631B9]" to='/'>Refill</Link>
                <Link className="font-semibold hover:border-b-4 border-[#D631B9]" to='/dashboard'>Earn</Link>
                {/* <Link className="font-normal hover:font-bold text-md" to='/earn'>Earn</Link>  */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar"/>
            </div>
        </div>
    )
}

export default Navbar;