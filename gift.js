function build_Gift(userId, pic, name, num) {
    switch (num) {
        case 0:
            return {
                "to": userId,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "e同購抽獎遊戲",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "特獎",
                                        "weight": "bold",
                                        "color": "#444444",
                                        "size": "xl"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/TAW-A150Ls.jpg",
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "fit",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "md",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://linecorp.com"
                                },
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "大同15KG定頻洗衣機",
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "horizontal",
                                        "spacing": "md",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": pic,
                                                "aspectMode": "cover",
                                                "aspectRatio": "4:3",
                                                "size": "sm",
                                                "gravity": "bottom"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": name,
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "抽到特獎",
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "color": "#e60412",
                                        "action": {
                                            "type": "uri",
                                            "label": "登入e同購",
                                            "uri": "https://www.etungo.com.tw/inside/377/722/728/60127.html"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
        case 1:
            return {
                "to": userId,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "e同購抽獎遊戲",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "頭獎",
                                        "weight": "bold",
                                        "color": "#444444",
                                        "size": "xl"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/23090.jpg",
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "fit",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://www.etungo.com.tw/inside/377/725/747/59393.html"
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "md",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://linecorp.com"
                                },
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "大同24型多媒體液晶顯示器",
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "horizontal",
                                        "spacing": "md",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": pic,
                                                "aspectMode": "cover",
                                                "aspectRatio": "4:3",
                                                "size": "sm",
                                                "gravity": "bottom"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": name,
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "抽到頭獎",
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "color": "#e60412",
                                        "action": {
                                            "type": "uri",
                                            "label": "登入e同購",
                                            "uri": "https://www.etungo.com.tw/inside/377/725/747/59393.html"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
        case 2:
            return {
                "to": userId,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "e同購抽獎遊戲",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "二獎",
                                        "weight": "bold",
                                        "color": "#444444",
                                        "size": "xl"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/PF-6374.jpg",
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "fit",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://www.etungo.com.tw/inside/377/723/739/67608.html"
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "md",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://linecorp.com"
                                },
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "友情牌紫外線不銹鋼烘碗機",
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "horizontal",
                                        "spacing": "md",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": pic,
                                                "aspectMode": "cover",
                                                "aspectRatio": "4:3",
                                                "size": "sm",
                                                "gravity": "bottom"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": name,
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "抽到二獎",
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "color": "#e60412",
                                        "action": {
                                            "type": "uri",
                                            "label": "登入e同購",
                                            "uri": "https://www.etungo.com.tw/inside/377/723/739/67608.html"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
        case 3:
            return {
                "to": userId,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "e同購抽獎遊戲",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "三獎",
                                        "weight": "bold",
                                        "color": "#444444",
                                        "size": "xl"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/ECO1L-GN.jpg",
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "fit",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://www.etungo.com.tw/inside/377/723/738/64287.html"
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "md",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://linecorp.com"
                                },
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "綠恩家舒打健康氣泡水機",
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "horizontal",
                                        "spacing": "md",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": pic,
                                                "aspectMode": "cover",
                                                "aspectRatio": "4:3",
                                                "size": "sm",
                                                "gravity": "bottom"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": name,
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "抽到三獎",
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "color": "#e60412",
                                        "action": {
                                            "type": "uri",
                                            "label": "登入e同購",
                                            "uri": "https://www.etungo.com.tw/inside/377/723/738/64287.html"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
        case 4:
            return {
                "to": userId,
                "messages": [
                    {
                        "type": "flex",
                        "altText": "e同購抽獎遊戲",
                        "contents": {
                            "type": "bubble",
                            "header": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "四獎",
                                        "weight": "bold",
                                        "color": "#444444",
                                        "size": "xl"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://www.etungo.com.tw/files/TC_PSpec/PS_Pic/TM-516.jpg",
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "fit",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://www.etungo.com.tw/inside/377/723/735/25309.html"
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "md",
                                "action": {
                                    "type": "uri",
                                    "uri": "https://linecorp.com"
                                },
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "麵糰大師多功能手持攪拌機",
                                        "size": "xl",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "horizontal",
                                        "spacing": "md",
                                        "contents": [
                                            {
                                                "type": "image",
                                                "url": pic,
                                                "aspectMode": "cover",
                                                "aspectRatio": "4:3",
                                                "size": "sm",
                                                "gravity": "bottom"
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": name,
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    },
                                                    {
                                                        "type": "text",
                                                        "text": "抽到四獎",
                                                        "size": "sm",
                                                        "color": "#444444"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "color": "#e60412",
                                        "action": {
                                            "type": "uri",
                                            "label": "登入e同購",
                                            "uri": "https://www.etungo.com.tw/inside/377/723/735/25309.html"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            };
        case 5:
            return {
                'to': userId,
                'messages': [
                    { 'type': 'text', 'text': "太可惜了，什麼都沒抽到，下次再試試吧!!" }
                ]
            };
    }
}

exports.build_Gift = build_Gift;