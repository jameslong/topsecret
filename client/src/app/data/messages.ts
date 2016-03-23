import Folder = require('../folder');
import Message = require('../message');

export const inboxMessages: Message.Message[] = [{
        id: "<0@gmail.com>",
        date: "2011-10-05T14:48:00.000Z",
        read: false,
        replied: false,
        from: "Luke Skywalker <luke.skywalker@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "You're my only hope",
        body: `Here are all our keys:

-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxsBNBFYK0ZMBCACb+C8Wns+tqz8\/9lEfIuPmCBfh1VPPG2hmU1tQn4vFeJkkWWnT\n3lWmgQMA0Gb0kj4XO2LyhR5c3x7sAkcO6vBXFM7lXwFauCmH1fQCPV2RAMsAzy+V\nRm5+32tLxw1uUBmJ8kpPbMl2bGeCbu24rN1nQ128ThegUyvcTX1lxwRS2RcCcli\/\nrzDRRe0g\/LgrOVWcZ+TjtY00+\/dlniRshCO8fNo\/\/vz9pPf2oApYw3y+KyDTbvjm\nrgP1Cw6qeP7uZNF4IJ45Y\/C+rkEJ228foq1hCEMX72bKrLPhn0syR4Oj\/SitYKqK\nP5TEmK84ZrGUitdUom0yMuSpXLI1Wi2oxFsFABEBAAHNN01pY2hhZWwgQWxleGFu\nZGVyIDxkaXJlY3RvckB0ZXN0bWFpbC5wbGF5dG9wc2VjcmV0LmNvbT7CwG0EEwEK\nABcFAlYK0ZMCGy8DCwkHAxUKCAIeAQIXgAAKCRA7mh\/ZPUNOWLo4B\/9F7+qxpdPV\nTEDLGYOZ9BfOfvnIE5x8OfobuVyMePmkm2oYXRKyeKmKXY1q5rcgDTp19C2Glzxs\nz\/5jF\/UYUrqzmU47PtP5XZ+aSiUatTt70QsMDsu\/zieQqHkXUGWAkVINWOjCwE85\n0Q49QN3f0KTadAelp8kPAWhmvO2FEyXwoUy9Cd7tKGFMOpHPEPZpFSFRD7Gk\/w6R\njQZ0Ap2sI843VZVGfgWCKaFOUwTecPKoxV\/jKQdmxUTENu7xowx22V2C7LcMvJFp\ndx4AfIcU1UElLnJpUTPcC3Si6IwUF3kD5WY+2kj1XFMGiSLAGu8\/KkXzYxSsqGAi\ndJRuM5slhpVZzo0EVgrRkwEEALzS29haFDI\/y8Fjos0sO+DQEXvXtDs\/BR4+IcRV\n0MutTnJfnoe43nV5BMOWbausy6IPwSPBEimDwekQBDCWjuoBe1lcwGWLymsQApg5\ncXdiYsJYdrorly6c+7aqfUmepGVX0000eedUO\/\/gJkMZkKPJTeH0fEJXqdTUZf1p\npERDABEBAAHCwQMEGAEKAA8FAlYK0ZMFCQ8JnAACGy4AqAkQO5of2T1DTlidIAQZ\nAQoABgUCVgrRkwAKCRA\/po7WdwBDutpPBACtkgKFrMzCQUByezG3siz8rURi9yPV\nG2Dxbq6xA5DN0lf2aBsV583+qTKOTdOsL7N+ANMqBDwwsSuiCePezg\/MngENLZ4h\n1yX3lrrMEk1kHK4ait9xgVT14ioRLxyZmiRnK7Qq4WP2d9y9vFPM1W0jJ7bTk0oh\nF5nbfOIbG6cNDj6nB\/9vvravds0VMCvQ9m75VD5EsKUWAETeDxNmLfXywNslYf6I\nl03CSm0jYZL\/waHmn\/DyoDze2pFusmIAbUmrRaUMBvU2DPV+2PPkl60Hz9JK7iEx\nruPy0qAsXOBWz1wLTjx8RWFRIGNjhBOxi5McKT61vXRPOjxn3MvfKwjDGrsRjr58\nPnRw4SzugI\/jtXKub8buD5h2fTXX7RhmWIj24PkEGqMGvF\/Byaacn5dhyZ\/CTrp3\nYPXTYgkA63iQSXusveK1cM+JmS1TMplaWdz0l2s6oW4jJqeJSnSCLdEXa+G7N6Fg\npjrIKImIrDTlBZsIs82LQ52sXyTf8GAB1nPqTDfJzo0EVgrRkwEEAKW4N9eP6g5v\naSB2dou\/31vIUc7KD8PfbzTuHopr\/uKBH9E5YjinUNXhlcL\/Hne4qHInI0lGZcl5\nR7u2vFW8ldU1+XNwneWhp3qtT73CZsZj6pK+Q8I+zNvVlzWDZOyXRGO9m3yYJevy\noDRWv82lKN0INqqc2fKUAjdbrpIE110JABEBAAHCwQMEGAEKAA8FAlYK0ZMFCQ8J\nnAACGy4AqAkQO5of2T1DTlidIAQZAQoABgUCVgrRkwAKCRCAFFM0XM0U3mqBBACP\ndySSPffdppSMNen9RJtbz6qUD5sNDU1slzcppLeXYbaPqSYC\/TeWFsncYZhjoCFT\nwMib5QyKgdGCscURIjjyQ6stoiTrfgJBWAuQ6NYmg\/IknEAGiyJqL8M+3S9grygL\nxhLHUb87H4O2A8F9pMnuFFw41Ey2UeHPL0UNNFxWQ3TQB\/90pFbYaFrlkC6J6kwQ\nXiVCKaAU1i8n+7HhmIjXVPx96C5z9t1qeCFIENvAsEwRh5gMDOX8x5pMvobhWCs8\nOXTJnpi1zc7qkqvXS3sVNu35auLcIN3WXERKCD8U7yXNBN5AwtC82DuU4wu1Nwrl\n+5qiz\/54lZ\/g8mtjnOuQJlVwqCJHoUhS0a4wNucjFsFx1dNmbPELIejltoAqb\/Pu\nJZWWBySM3Sf6JFABRB3hWzC4mgkw7TrJjr5WZeRwPQOGOtaf5xyg45RTbvxg5gf+\ndQvDF5NArr3BGVbV+wemV2ZB0ZlZ3Y7aaAo81F+ec6q79QYeaGv0nuZlGKEXqrev\nizGi\n=qeqx\n-----END PGP PUBLIC KEY BLOCK-----

-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxsBNBFYK0lgBCACqUKqNmLA3eVJzWkQW+Wj5gn5oz2B2KICROuOhmlH2e4uH0by8\nxvq6kZQ9Y+JGrYTVOLuKSlX0BLCnkCSkQsFk3eFb72dBMKMnSW\/nMNLG3g0WTpA1\nRXSTrZXPUrJ01WA3crN5JkHGqHL9TDVXYREXYDg9cr2qm4CusCjJZ3Abty3oY4i3\nsRB7Qww7\/wgU+iLdfMc80hrqPWGSk5HGLOww8J2eVUlPFRY7L9D7LyMajNlcTdUJ\nn3iPPQOz4IMOoOA1lNdT5cOTcCEeRMlGwgmjSNc4hcDJgKBHRc7576TFBmReQPxx\nRcmR2NqXK99220URgjyKF\/Dxp37cuQaTTYUfABEBAAHNNEV0aGFuIEhpY2tzIDxl\ndGhhbi5oaWNrc0B0ZXN0bWFpbC5wbGF5dG9wc2VjcmV0LmNvbT7CwG0EEwEKABcF\nAlYK0lgCGy8DCwkHAxUKCAIeAQIXgAAKCRDaKZyXC1VWyShVB\/9M0YD4F12\/gbcW\n2bsI5D1+q8wrElFAJ3YCh410hqETXnYc4elpqZgOfqBQyfxlPX7HxsjpMWC2OcnP\n+Myk7QM\/kK9BGKJC0TOGNZkYNyNzB8Ly0MBbm7iaKzUqn7FCtyRSTyrcgNyfIumH\n2LRgrF81yzHxaiJ1tigssUNU7YhwNRFCwRLLtLik76xT0uNTneprAdrhHTNUHsMP\nBQI\/Ev3TjLWAng5r+RZHFcw0vSbcL5Sd7kLgxYtt6BL2erR0G8bo98bcgby\/jwpb\nTFEavaxEKS6pYFXoYW1yg4mnibxDm1dgo1ncW1VwIXuxHjvOLcK+6aWrLPfKYO1S\nDkCWAD8tzo0EVgrSWAEEAMcLk2G7\/fczrG\/nCNNQO6dd6mQ4LFxdNDcGwB\/GvdNE\no2MRrn9Seannh2V3zfflm4O0OyldMDe69o312JZ4CbP1vmTel9\/gxgIyQVZUOD3m\ngGTtj+Fzx4GZW3FAFXzyrkfTu\/R0jGE2SWH7oB0vFlgfKs83SIqR670TTCnqOdcf\nABEBAAHCwQMEGAEKAA8FAlYK0lgFCQ8JnAACGy4AqAkQ2imclwtVVsmdIAQZAQoA\nBgUCVgrSWAAKCRBvDkGYgYbwJJXSBAC132B7WD9qJeHm7EYXZ+MuAg0OuS2mcQlA\nRLjifG8KMW3PoQLc09TaUc+0oZrK6fqssQTrLyZn3hVELaD4iaNiOWRDcgVO3nK0\n7I3Fkw7cO6cfyGR5uw\/hd0r1Mg2meMQxIL6CQO4Xqm53Ei3mUAF+Phr5g2b4ggu\/\nLT7Ko26e\/orRB\/sFQ9XFeddQ74gXYr6iIGAynCESBh6mPDJd8UVh3CZ4vus0Ud5q\nnT4SjD2Hebm4ZvA1gDDgtfRnrIjPnFOyvO6N101nc27BhzIvxSQAkvHFPJLJZHFT\n\/jpex8cZ57t0QRH9W5WskuAILnPF4kJMtzm7OoHbT7EpwYKwOO4GU+xD2VV5LDFI\nPmzW96falK5fvxzS2pC4dnrMCDgB\/ADQt107opKVlMbQwIvllc9zUF9Fk7qmSwwp\n30oFWErXFklpI9S4UZgJ7aDtpn4g4MKFw3j5tn6n2Ix2C4ys6wVEgNprWr2FfoJX\nbnZO9vNWdNaI8Vtz3Z8GZKotXbYrpAq\/0gFMzo0EVgrSWAEEALs+8lvBTjOSCbnw\nPBetP3DqRJ9xrmCuVMb12CR5ioaRFj41sLqb+ICP2TmOmqlmx+asSekdWyQEAZSb\nDrSDlgVZsjrynOPz7sHmj757Mgsr13ySwIYXGPqylkxSI0Zu32nGpyFrunQlbnWb\nLh9mDbO1d0MKTfS5ab\/QN3nwRhwjABEBAAHCwQMEGAEKAA8FAlYK0lgFCQ8JnAAC\nGy4AqAkQ2imclwtVVsmdIAQZAQoABgUCVgrSWAAKCRCtXmnAJYnWl\/zNA\/44Ui03\n+Ty722ssELV5zggqacUVKCI3tEVE\/cbd8eqEsxohARICTZ2vnoUW\/bzkEvW2\/wUJ\nCpaNVU67xyfJWVorrRDPwwVDlVaygN5sxbucRVIbYbkUNvsa9N6JrFK95\/Bu6XPK\nqZAKDr\/ltKWIZpxG3xxSL4cDQ7XCrUGZ7B67JjRpB\/9laeaPdTT1w6zm1x7kfMiH\nqNNQDndqU3rih314l9Fg+drg7ELK+FxIWwNOt\/wCQ8UfiqEidNJ6\/iqY1BJ0OITA\n4rcdGb4SaoQ9MxOHeNv67B6DPG1ADfof5YIIoLlrNUMYO3KzIXR2LVJNkVQ5tW\/8\nhl2JmObGkuYYP0oULDWLlHqy7Nva2WWSvrmCEDdKupRG6LKBKZoktpDr3zZ1CnLM\n1B99J80eLYxhir+2Bl9uK8JmhK6X8z2wFtVBeWcWQxr2X+SAaPafnMYFbIaocQI3\nrwTz++MT16SuCgIqpppWaw+cYZy7J1C3MZ4rQ7zWZOf+TCQCC6In\/fC81lGd29sw\n=TLPw\n-----END PGP PUBLIC KEY BLOCK-----

-----BEGIN PGP PUBLIC KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxsBNBFYK0rQBCAC2\/cvLHWw0uguOC6A3DwMJz+i8bSvgLaNccVV1fO3Q4ncoat1h\nJZ\/rlFxfIkbsi4ogDpqNA9yc\/35Z9z8fZpIL\/sWse7p4Qd7pgKGMg\/W+KMz\/\/UMz\nBN1Wj2CPBToz6cU4zPYV60ioM7wrlC+oH3S5wHMX9MhcWKfB+3OX23ATDpzpeqRA\nZP6krCSvLQkJHLD5KhsRFNazsr2ZL455fjdpPRI6WkfORR9\/UhN5CHClXpYPvlJR\nuy3gdBFJHu4gsa97ffEv1nAnkPwcYGY4aH13CN797hvxMRJ81d4GZ8sYVkrai9vX\nRHg4kypntsULked+ubOwINhKkRm8rfFpaHKtABEBAAHNMkplbm5pZmVyIEhhbGwg\nPGNhcmVlcnNAdGVzdG1haWwucGxheXRvcHNlY3JldC5jb20+wsBtBBMBCgAXBQJW\nCtK0AhsvAwsJBwMVCggCHgECF4AACgkQANG0aQMuQFN2EwgAhdJEB\/WIt5ZB2uc3\n5tmd38fB8hYcLmFDfIGzv6NQ2pNcvEoXZa9FqMHBx3s09CqtvuHtW9gGI1qMuk0c\nsYHrvToM3fqPN7Q\/+DZ6RUmbRNVXrnF6ol2N3HbVxP10YfvVA2NqY0fVdfR5v1IN\nLYm61013XC8ic4KuLD1TaoiwDdC0CeA0dCNpAsfKUzHweN5OLQmkgUg46SYvSIWb\nrWNRqXEeF0Ysk6WJP7ZgGI80vdYKewtJk8mpfA4FSi\/VXxdplYIejB+1sT51LZL5\noaTcm7tSZIyC1HE569TibV+XLPQeenTx95WvfpGeNXWtkoR2ZpylNDrSRfF1Fxty\nuVzGPc6NBFYK0rQBBACvQlhyxNYbyF5gz3nlVwQSzmKkuY8Kiid+JBwvwYVI0c56\n\/+VFA\/5SQTdd6LYb\/nN9jL7ZNF9qmsCSAc1YInOSbPGE3c917skf6iCbTmBcGdWW\nKF\/c2jMt\/O5bqVBgoPbfNn4ESrJlfMyYAEIlopj5r3eNInLheFmx8+KeAtYKuwAR\nAQABwsEDBBgBCgAPBQJWCtK0BQkPCZwAAhsuAKgJEADRtGkDLkBTnSAEGQEKAAYF\nAlYK0rQACgkQ9\/Vq5MyemOyH8gQAgPkD7tvFmjFe72iNAMUtuq3HIpV8pTm1lhvx\nP49dNFUVPxrcNaYb\/9H1PBwcwEgqf\/iicaAsFdCOjDZh3NR9PplcIiHHCOuRaOfh\ngG3KeXCA97XJCcDExXwRTzoqy8f1yvHgTNqFX6YroNDhmlD\/r\/MYpcAkvCMggfTH\nrhWi17FGgwf\/WLq968bIv+o6iBQvGax+mkSPvZ0F\/UBYSacWtNZVbwf4uXL+Dw0\/\nOOYAomVCTD6lWSKoNUkts3YABaR8grLr0MBTXVJCIco4B91X6qbrE2i8IWa3GF+8\nrAmoHQjoUUr4VSEWnKh+AyHReZ+tDprNJx6O5DFyu892sQVZflTxb8rwV69aop5I\nDZSQsHKIP+ow1Zaz8K6Plm+TSLCgkhkk60EgFvGcUcAfJ6AOBL4blx\/mD22BfRf0\nGbK5iYCWfaUvZUIvUPkFzvTnjLjs0g8QkBO9Vc8TJVfo0Fmty9USlVpv2wlj2eBn\nmvFIQErCY9DlkIvF5Os5wXgJOx+N5Ce\/8M6NBFYK0rQBBADG\/P1v1estqFYhKoZS\n1\/a2JyGvgWTuHHF1hhTUC4RYzd8WSv7c0on\/2te3z7KkVPvJaknvOfmVszj5pb\/S\nz7ofyUgj6I2825JtZwtQbARzHX25KWLHDeI7fT1nCSQxddw\/URrKdLt24YcnHCFm\nP0kHtuxp2astDlXlrWFTtXs2hwARAQABwsEDBBgBCgAPBQJWCtK0BQkPCZwAAhsu\nAKgJEADRtGkDLkBTnSAEGQEKAAYFAlYK0rQACgkQCrw0qZ8beHuN8AP7BeRNR1Vt\ntI6\/tugNfsAJwbI1yhTNYcvrnUgoDZH9k0UZc1GRTodQxw4IpAEfqdpT3AYWawde\n54rvQYcKjdccYrQ7IWTJC+jRnxpC2Rd4EaAnspwnWmlbFlD4MsoTdjEtxmOEBvpp\nQHpkERMFmRJgUaIz1OpAvEz+Zs+F\/y9Y5cEtrwf\/Yt5Fcx6gXq2Dm85+Qp1cMEi5\nh2u6+JJg26doXQPkz1sOT4WfB8XXPDReh4lIXq1Y5KOIaKJQuH7Uyfp6WRzaGFUz\n48YdKIDOdx2ZIqbWWHYVWS9LdSqamRB\/7omiOnjjQlZ4Y8AF5ZUgpbLDn930v4Kw\n8UdEPj1uQzq04W58EpqDyLLA8MqIWyujfsRq6PrQBVVmkDOkx6JseTODHOVytb3H\ntaZ13mMSRRpL0xK\/Ji5XWCQLGJ8XWrEZi5EAC07hPDN3WPgoghoFU6btLYYGbMFw\nX5PGnrA3IUYUOGi5ZF2hO\/BdlZ\/uUejDtprt2YD6MpETt+QM7Mlr5bcgzF+q0w==\n=MZ\/z\n-----END PGP PUBLIC KEY BLOCK-----
        `,
}, {
        id: "<1@gmail.com>",
        date: "2011-10-06T14:48:00.000Z",
        read: false,
        replied: false,
        from: "Han Solo <han.solo@riseup.net>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "Re: You're my only hope",
        body: "Go away, I'm only in it for the money, I don't want to help anyone."
}, {
        id: "<2@gmail.com>",
        date: "2011-10-07T14:48:00.000Z",
        read: false,
        replied: false,
        from: "Princess Leia <sculptedhair@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "Re: You're my only hope",
        body: "Han, let's have a son together. I love you and there's no way this can turn out badly",
}, {
        id: "<3@gmail.com>",
        date: "2011-10-08T14:48:00.000Z",
        read: false,
        replied: false,
        from: "Kylo Ren <darth.emo@aol.com>",
        to: "Han Solo <han.solo@riseup.net>",
        subject: "I am your son",
        body: "I know what I have to do but I need your help to do it. Will you help me?",
}, {
        id: "<4@gmail.com>",
        date: "2011-10-09T14:48:00.000Z",
        read: false,
        replied: false,
        from: "Luke Skywalker <luke.skywalker@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "Use the force luke",
        body: "Help me, I really need you help to use the force",
}, {
        id: "<5@gmail.com>",
        date: "2011-10-10T14:48:00.000Z",
        read: true,
        replied: true,
        from: "Han Solo <han.solo@riseup.net>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "I am your father",
        body: "Go away, I'm only in it for the money, I don't want to help anyone."
}, {
        id: "<6@gmail.com>",
        date: "2011-10-11T14:48:00.000Z",
        read: true,
        replied: false,
        from: "Princess Leia <sculptedhair@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "The senate will never accept this!",
        body: "Han, let's have a son together. I love you and there's no way this can turn out badly",
}, {
        id: "<7@gmail.com>",
        date: "2011-10-12T14:48:00.000Z",
        read: true,
        replied: true,
        from: "Kylo Ren <darth.emo@aol.com>",
        to: "Han Solo <han.solo@riseup.net>",
        subject: "Fear leads to the dark side",
        body: "I know what I have to do but I need your help to do it. Will you help me?",
}, {
        id: "<8@gmail.com>",
        date: "2011-10-13T14:48:00.000Z",
        read: true,
        replied: false,
        from: "Kylo Ren <darth.emo@aol.com>",
        to: "Han Solo <han.solo@riseup.net>",
        subject: "Re: Fear leads to the dark side",
        body: "I know what I have to do but I need your help to do it. Will you help me?",
}, {
        id: "<9@gmail.com>",
        date: "2011-10-14T14:48:00.000Z",
        read: true,
        replied: false,
        from: "Luke Skywalker <luke.skywalker@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "This is the email client you are looking for",
        body: "Help me, I really need you help to use the force",
}, {
        id: "<10@gmail.com>",
        date: "2011-10-15T14:48:00.000Z",
        read: true,
        replied: true,
        from: "Han Solo <han.solo@riseup.net>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "Mind your feelings",
        body: "Go away, I'm only in it for the money, I don't want to help anyone."
}, {
        id: "<11gmail.com>",
        date: "2011-10-16T14:48:00.000Z",
        read: true,
        replied: false,
        from: "Princess Leia <sculptedhair@gmail.com>",
        to: "Kylo Ren <darth.emo@aol.com>",
        subject: "Blah blah blah some trade treaty",
        body: "Han, let's have a son together. I love you and there's no way this can turn out badly",
}, {
        id: "<12@gmail.com>",
        date: "2011-10-17T14:48:00.000Z",
        read: true,
        replied: true,
        from: "Kylo Ren <darth.emo@aol.com>",
        to: "Han Solo <han.solo@riseup.net>",
        subject: "Out of order this subject is",
        body: "I know what I have to do but I need your help to do it. Will you help me?",
}];

export const folders: Folder.FolderData[] = [{
        id: 'inbox',
        type: Folder.Types.INBOX,
        displayName: 'Inbox',
        messages: [],
}, {
        id: 'sent',
        type: Folder.Types.SENT,
        displayName: 'Sent',
        messages: [],
}];
