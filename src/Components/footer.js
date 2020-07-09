import React, { Component } from 'react';
import './CSS/footer.css';
class Footer extends Component {
    render() {
        return (
            <div>
                <div className="footer">
                    <div className="copyright-text">
                        Copyright © 2020 Viral Prediction
                    </div>
                    <div className="copyright-text">
                        Powered by <a href="https://techieclan.com" target="_default">Techie Clan</a>
                    </div>
                    <div className="copyright-text">
                        API by <a href="https://corona.lmao.ninja/" target="_default">NOVELCovid/API</a>
                    </div>
                    <div className="copyright-text">
                        News by <a href="https://newsapi.org/" target="_default">News API</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
