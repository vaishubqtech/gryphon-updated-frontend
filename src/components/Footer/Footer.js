import React from 'react'
import "./footer.css"

const Footer = () => {
    return (
        <div className='footer-section'>
            <div className='footer-container'>
                <div className='footer-copyrights'>
                    2021-2025 Gryphon Protocol | All Rights Reserved
                </div>
                <div className='footer-flex'>
                    <div className='footer-list'>Whitepaper</div>
                    <div className='footer-list'>Litepaper</div>
                    <div className='footer-list'>Legal Disclaimer</div>
                </div>
                <div className='footer-copyrights'>
                    Crypto Data by CoinGecko
                </div>
            </div>
        </div>
    )
}

export default Footer
