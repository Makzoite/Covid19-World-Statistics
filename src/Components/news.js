//This page is for showing news related to COVID-19 from NewAPI.

import React, { Component } from 'react';
import './CSS/news.css';
import './CSS/covidAPI.css';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, CardGroup, Card, Button } from 'react-bootstrap';
import franc from 'franc';
class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            isDataLoaded: false
        };
    }
    componentDidMount() {
        var d = new Date();
        d.setDate(d.getDate() - 3);//get all the news that from 3 days earlier
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";//Security issue while rendering the news link and used proxyURL.
        const url = `${proxyUrl}https://newsapi.org/v2/everything?q=COVID&from=${d.toISOString().split('T')[0]}&sortBy=publishedAt&apiKey=a5c61e1b7e304ab290548cdbe3dceee7&pageSize=100&page=1`;
        const request = new Request(url);
        fetch(request)
            .then(res => res.json())
            .then(json => {
                const objNews = [];
                for (var i = 0; i < json.articles.length; i++) {
                    if (franc(json.articles[i].description) == "eng") {
                        //changing all the non secured link to secured link
                        if (json.articles[i].url.indexOf('https://') === -1) {
                            json.articles[i].url = json.articles[i].url.replace("http://", "https://");
                        }
                        if (json.articles[i].urlToImage !== null && json.articles[i].urlToImage.indexOf('https://') === -1) {
                            json.articles[i].urlToImage = json.articles[i].urlToImage.replace("http://", "https://");
                        }
                        objNews.push(json.articles[i]);
                    }
                }
                const arrNews = [];
                for (var i = 0; i < objNews.length; i++) {
                    const news =
                        <CardGroup style={{ padding: "30px" }}>
                            <Card style={{ padding: "20px" }}>
                                <Card.Img variant="top" className="news-image" src={objNews[i].urlToImage} />
                                <Card.Body>
                                    <Card.Title>{objNews[i].title}</Card.Title>
                                    <Card.Text>
                                        {objNews[i].description}
                                    </Card.Text>
                                </Card.Body>
                                <Button variant="primary" href={objNews[i].url} target="_default">Read More</Button>
                                <Card.Footer>
                                    <small className="text-muted">{this.convertDate(objNews[i].publishedAt)}</small>
                                </Card.Footer>
                            </Card>
                            {++i < objNews.length
                                ? <Card style={{ padding: "20px" }}>
                                    <Card.Img variant="top" className="news-image" src={objNews[i].urlToImage} />
                                    <Card.Body>
                                        <Card.Title>{objNews[i].title}</Card.Title>
                                        <Card.Text>
                                            {objNews[i].description}
                                        </Card.Text>
                                    </Card.Body>
                                    <Button variant="primary" href={objNews[i].url} target="_default">Read More</Button>
                                    <Card.Footer>
                                        <small className="text-muted">{this.convertDate(objNews[i].publishedAt)}</small>
                                    </Card.Footer>
                                </Card>
                                : <></>
                            }
                        </CardGroup>;
                    arrNews.push(news);
                }
                this.setState({
                    news: arrNews,
                    isDataLoaded: true
                })
            });
    }
    convertDate(jsonDate) {
        const date = new Date(jsonDate);
        return date.toUTCString();
    }
    render() {
        const {
            news,
            isDataLoaded
        } = this.state;
        if (isDataLoaded)
            return (
                <>
                    <div style={{ margin: "20px 40px 20px 40px", textAlign: "center" }}>
                        <div className="heading-topic">COVID-19 Global News</div>
                        <Container>
                            <Row>
                                <Col></Col>
                                <Col xs={4}>
                                    <div className="horizontal-line"></div>
                                </Col>
                                <Col></Col>
                            </Row>
                        </Container>
                    </div>
                    {news}
                </>
            );
        else
            return (
                <div>
                    <div className="loader"></div>
                </div>
            );
    }
}

export default News;
