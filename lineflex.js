var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config.json', 'utf8');
config = JSON.parse(config);
var lineflex = function (logger) {
    this.CreateActivityFlex = function (activity) {
        var url = '';
        if (activity.type == 'eat')
            url = config.image.activity_flex.diet;
        else if (activity.type == 'sale')
            url = config.image.activity_flex.sale;
        else if (activity.type == 'sleep')
            url = config.image.activity_flex.stay;
        var activity_flex = {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": url,
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                    {
                        "type": "text",
                        "text": activity.name,
                        "wrap": true,
                        "weight": "bold",
                        "gravity": "center",
                        "size": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "lg",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "活動描述:",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 2
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": " ",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 1
                                    },
                                    {
                                        "type": "text",
                                        "text": activity.description,
                                        "wrap": true,
                                        "size": "sm",
                                        "color": "#666666",
                                        "flex": 6
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "需求人數:",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 2
                                    },
                                    {
                                        "type": "text",
                                        "text": activity.number + '人',
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "baseline",
                                "spacing": "sm",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "活動時間:",
                                        "color": "#aaaaaa",
                                        "size": "sm",
                                        "flex": 2
                                    },
                                    {
                                        "type": "text",
                                        "text": Date(activity.endtime),
                                        "wrap": true,
                                        "color": "#666666",
                                        "size": "sm",
                                        "flex": 4
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "height": "sm",
                        "action": {
                            "type": "postback",
                            "label": "參加",
                            "data": "action=" + activity.shuangjiouid
                        }
                    },
                    {
                        "type": "spacer",
                        "size": "sm"
                    }
                ],
                "flex": 0
            }
        }
        return activity_flex;
    }

    this.CreateActivityFlexCarousel = function (activitys) {
        var flexs = [];
        var length;
        if (activitys.length > 5)
            length = 5;
        else
            length = activitys.length;
        for (var index = 0; index < length; index++) {
            var activity = activitys[index];
            var url = '';
            if (activity.type == 'eat')
                url = config.image.activity_flex.diet;
            else if (activity.type == 'sale')
                url = config.image.activity_flex.sale;
            else if (activity.type == 'sleep')
                url = config.image.activity_flex.stay;
            var activity_flex = {
                "type": "bubble",
                "hero": {
                    "type": "image",
                    "url": url,
                    "size": "full",
                    "aspectRatio": "20:13",
                    "aspectMode": "cover"
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "md",
                    "contents": [
                        {
                            "type": "text",
                            "text": activity.name,
                            "wrap": true,
                            "weight": "bold",
                            "gravity": "center",
                            "size": "xl"
                        },
                        {
                            "type": "box",
                            "layout": "vertical",
                            "margin": "lg",
                            "spacing": "sm",
                            "contents": [
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "活動描述:",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 2
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": " ",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1
                                        },
                                        {
                                            "type": "text",
                                            "text": activity.description,
                                            "wrap": true,
                                            "size": "sm",
                                            "color": "#666666",
                                            "flex": 6
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "需求人數:",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 2
                                        },
                                        {
                                            "type": "text",
                                            "text": activity.number + '人',
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 4
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "活動時間:",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 2
                                        },
                                        {
                                            "type": "text",
                                            "text": Date(activity.endtime),
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 4
                                        }
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "uri",
                                                "label": "活動地點",
                                                "uri": "https://linehack2018.azurewebsites.net/map/" + activity.latitude + ',' + activity.longitude
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "sm",
                    "contents": [
                        {
                            "type": "button",
                            "style": "link",
                            "height": "sm",
                            "action": {
                                "type": "postback",
                                "label": "參加",
                                "data": "action=" + activity.shuangjiouid
                            }
                        },
                        {
                            "type": "spacer",
                            "size": "sm"
                        }
                    ],
                    "flex": 0
                }
            }
            flexs.push(activity_flex);
        }

        var more_activity_flex = {
            "type": "carousel",
            "contents": flexs
        }
        return more_activity_flex;
    }
}
exports.lineflex = lineflex;