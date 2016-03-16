/// <reference path="../typings/chai-as-promised/chai-as-promised.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../core/src/app/global.d.ts"/>
import Kbpgp = require('../core/src/app/kbpgp');

import Chai = require('chai');
import ChaiAsPromised = require('chai-as-promised');
Chai.use(ChaiAsPromised);

const key0 = {
        privateKey: "-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxcMGBFYK0rQBCAC2\/cvLHWw0uguOC6A3DwMJz+i8bSvgLaNccVV1fO3Q4ncoat1h\nJZ\/rlFxfIkbsi4ogDpqNA9yc\/35Z9z8fZpIL\/sWse7p4Qd7pgKGMg\/W+KMz\/\/UMz\nBN1Wj2CPBToz6cU4zPYV60ioM7wrlC+oH3S5wHMX9MhcWKfB+3OX23ATDpzpeqRA\nZP6krCSvLQkJHLD5KhsRFNazsr2ZL455fjdpPRI6WkfORR9\/UhN5CHClXpYPvlJR\nuy3gdBFJHu4gsa97ffEv1nAnkPwcYGY4aH13CN797hvxMRJ81d4GZ8sYVkrai9vX\nRHg4kypntsULked+ubOwINhKkRm8rfFpaHKtABEBAAH+CQMI7GoCgetuuMBgYedf\nCVqJ2nYRumP6MlcxMEPLEfbQraFP+0mo4\/xC+g44Yi4oT5nNI4LuSJUlUdXG6cvV\nF7BWyK8U1UovtJcefiJM1m6aUDEXEC9nKT6PMh3boFs8H1sXjbn4CfUBVoLydpVM\naoHM\/DO7E59YFsngTfoD4JWL5O7COkhwpBNOyRV2+dZKLnqBK9hDwnCbqOYcRyyx\nistp54KE5lF64ELUHY8tKezG7WMGKEgERBPF1OBPkpt+RgGxE4yqt0evLGxEiphJ\nFH6d4RuIZ97T+Gc0hTZ8rWHuG1oEUtkPXo970wklKx2tEkzCIh9KgJMscbzM9MLJ\nj98NaEeVLWM6Dxqz743Bx+HjyYBpewgo9\/0iPZfBvLux74p5GIZxeVMGQUQHMK8C\naEC6QwxdfUI4FhGpyVUKkBfRe9cosFTnL65QZQJCmLB7MH+fsDr6qiZqTqsxCYbr\nRbV3FhUmecQoMVah5c4bTwDQiyH920K04OcLOcgDjwDqeaxTnqMxGGI5CdH1A4Ao\nwm9cjVHLTCJ5saLtiQnwQzFAXq2IIh\/ju3Jo\/CEJrWkxdx\/WGp+Zl\/CReEodhG25\nvo0eqsMg66M+uZG4lRW4n4z71qZx5\/7lp\/N7BTlOKkWA9s114fnJlq70ylJDn9s0\nVkB64lIZE3Eu12owndgyUyDCz+dnjThIStOC5xtC00MI6rtva0v9c0tVSRTmFdf8\nRa03yNUkjBC4rM506tehVqnIgSnb7SS9oLg4Npr0TngbKvEVD1ovV7DOvGmRVhbq\nm0ezTnYsy3hqRUM7ba4oN3oI01sBB6+h61vEze9XTBkmiaXVcINKdBGxGJmAr3wb\n6ibMjT8UNvqJpy3XC7GWNI4hS9qnv34vcVGXlPZW+zyItkOUi+LHtmVDz3VIuvjX\nBG18Gk7iBt8RzTJKZW5uaWZlciBIYWxsIDxjYXJlZXJzQHRlc3RtYWlsLnBsYXl0\nb3BzZWNyZXQuY29tPsLAbQQTAQoAFwUCVgrStAIbLwMLCQcDFQoIAh4BAheAAAoJ\nEADRtGkDLkBTdhMIAIXSRAf1iLeWQdrnN+bZnd\/HwfIWHC5hQ3yBs7+jUNqTXLxK\nF2WvRajBwcd7NPQqrb7h7VvYBiNajLpNHLGB6706DN36jze0P\/g2ekVJm0TVV65x\neqJdjdx21cT9dGH71QNjamNH1XX0eb9SDS2JutdNd1wvInOCriw9U2qIsA3QtAng\nNHQjaQLHylMx8HjeTi0JpIFIOOkmL0iFm61jUalxHhdGLJOliT+2YBiPNL3WCnsL\nSZPJqXwOBUov1V8XaZWCHowftbE+dS2S+aGk3Ju7UmSMgtRxOevU4m1flyz0Hnp0\n8feVr36RnjV1rZKEdmacpTQ60kXxdRcbcrlcxj3HwUYEVgrStAEEAK9CWHLE1hvI\nXmDPeeVXBBLOYqS5jwqKJ34kHC\/BhUjRznr\/5UUD\/lJBN13othv+c32Mvtk0X2qa\nwJIBzVgic5Js8YTdz3XuyR\/qIJtOYFwZ1ZYoX9zaMy387lupUGCg9t82fgRKsmV8\nzJgAQiWimPmvd40icuF4WbHz4p4C1gq7ABEBAAH+CQMIbe47lg8YW\/Rgt3blS8ZA\ndQV7lyryfNdxDVfylyo12bJPCp9jsVTRs8tXhEUY5nyqmck4V1h9QlmoNwHzMTmn\n22emnaGhaVnPlZfUXLNkpDOuBb4ZeaJEQSgVq5voGsoWNa7hIJqA52KTHTZGPq3w\n5NjkCC\/tjAcv2OR43qRtUmy6de5cc73SZ3qyt0fRMFyfBnEDL8mMxZXdj3048tAG\n4bpdJF6GOgnboXItmz6VKaySI+d3+JsqbBGJ+vQpRXCxpcMe\/6QdK0C\/yP9nZOs8\npwn33emYaABnbMB4nVveNSoFY8xdCsla4D2hjW2o9JvVyTIhIW\/tA0bk053LYItX\n\/1Gxi9PRPbXm9Q0s6t8boLk0SNcWc0HxtA3BaaHvOZVZB1+q6SmryWI3S9vwVh1i\nHGNF16uDj7pY3CUmA7\/pA+ZANbaLdDsiUwiC3yaOIbwKhYXpZBwvJYjIUo77PHx0\nhbkxjf5XQR36S959TZal92Bn\/wwIBcLBAwQYAQoADwUCVgrStAUJDwmcAAIbLgCo\nCRAA0bRpAy5AU50gBBkBCgAGBQJWCtK0AAoJEPf1auTMnpjsh\/IEAID5A+7bxZox\nXu9ojQDFLbqtxyKVfKU5tZYb8T+PXTRVFT8a3DWmG\/\/R9TwcHMBIKn\/4onGgLBXQ\njow2YdzUfT6ZXCIhxwjrkWjn4YBtynlwgPe1yQnAxMV8EU86KsvH9crx4EzahV+m\nK6DQ4ZpQ\/6\/zGKXAJLwjIIH0x64VotexRoMH\/1i6vevGyL\/qOogULxmsfppEj72d\nBf1AWEmnFrTWVW8H+Lly\/g8NPzjmAKJlQkw+pVkiqDVJLbN2AAWkfIKy69DAU11S\nQiHKOAfdV+qm6xNovCFmtxhfvKwJqB0I6FFK+FUhFpyofgMh0XmfrQ6azScejuQx\ncrvPdrEFWX5U8W\/K8FevWqKeSA2UkLByiD\/qMNWWs\/Cuj5Zvk0iwoJIZJOtBIBbx\nnFHAHyegDgS+G5cf5g9tgX0X9BmyuYmAln2lL2VCL1D5Bc7054y47NIPEJATvVXP\nEyVX6NBZrcvVEpVab9sJY9ngZ5rxSEBKwmPQ5ZCLxeTrOcF4CTsfjeQnv\/DHwUYE\nVgrStAEEAMb8\/W\/V6y2oViEqhlLX9rYnIa+BZO4ccXWGFNQLhFjN3xZK\/tzSif\/a\n17fPsqRU+8lqSe85+ZWzOPmlv9LPuh\/JSCPojbzbkm1nC1BsBHMdfbkpYscN4jt9\nPWcJJDF13D9RGsp0u3bhhyccIWY\/SQe27GnZqy0OVeWtYVO1ezaHABEBAAH+CQMI\nEnnrHP2pF1lgwFWJw4gvHB\/fWmaZCSod2iPPIJ5U5mQ5XLG791iynzBTgwVelAds\nF+lQ8Ubuyks\/b+rMzSA4LXld0TpYBEZN+nuJ\/qGRbZbXNEPvJHfgTJ5JgSJN4jPv\n5DU\/bxR8VopT2tzBVcvpGopn\/Yll9g1Q88alSYvRTYWRT+HhVkaEEso1pyGI+q2e\n4fTh8XtoN5dRyfc9fB07gGNdNB4hurpKEl\/mvCRAlk0A7\/aqIFXMOy0ACTSSVJIE\nBY6H4xYnVP30Jbk3UdNHAiHxwC3iV6E1iUL9IAs7v01jfOsyS2MTxU58Lwav9e+z\nydg85KDR8dgLztnHUzyxJq2GR4zh6BSoN\/NaXqNwYWRkkibsQXCEKV\/IcLpzvmk9\nqPoMBHeIPmT2XZ5sPXUsqvLiRL7Um5VgN5e+DK2Pia1DU0mp4ew5LBGfIH2scRSN\nJI3+sJg4BV7eXB3ZS0m4UDNS5ZaEuX8y9kDfuo2bsyMJbbRBqsLBAwQYAQoADwUC\nVgrStAUJDwmcAAIbLgCoCRAA0bRpAy5AU50gBBkBCgAGBQJWCtK0AAoJEAq8NKmf\nG3h7jfAD+wXkTUdVbbSOv7boDX7ACcGyNcoUzWHL651IKA2R\/ZNFGXNRkU6HUMcO\nCKQBH6naU9wGFmsHXueK70GHCo3XHGK0OyFkyQvo0Z8aQtkXeBGgJ7KcJ1ppWxZQ\n+DLKE3YxLcZjhAb6aUB6ZBETBZkSYFGiM9TqQLxM\/mbPhf8vWOXBLa8H\/2LeRXMe\noF6tg5vOfkKdXDBIuYdruviSYNunaF0D5M9bDk+FnwfF1zw0XoeJSF6tWOSjiGii\nULh+1Mn6elkc2hhVM+PGHSiAzncdmSKm1lh2FVkvS3UqmpkQf+6Jojp440JWeGPA\nBeWVIKWyw5\/d9L+CsPFHRD49bkM6tOFufBKag8iywPDKiFsro37Eauj60AVVZpAz\npMeibHkzgxzlcrW9x7Wmdd5jEkUaS9MSvyYuV1gkCxifF1qxGYuRAAtO4Twzd1j4\nKIIaBVOm7S2GBmzBcF+Txp6wNyFGFDhouWRdoTvwXZWf7lHow7aa7dmA+jKRE7fk\nDOzJa+W3IMxfqtM=\n=ag9L\n-----END PGP PRIVATE KEY BLOCK-----",
        passphrase: "test",
};

const key1 = {
        privateKey: "-----BEGIN PGP PRIVATE KEY BLOCK-----\nVersion: fnContact PGP \/ Keybase OpenPGP v1.0.0\nComment: https:\/\/fncontact.com\n\nxcMGBFYK0rQBCAC2\/cvLHWw0uguOC6A3DwMJz+i8bSvgLaNccVV1fO3Q4ncoat1h\nJZ\/rlFxfIkbsi4ogDpqNA9yc\/35Z9z8fZpIL\/sWse7p4Qd7pgKGMg\/W+KMz\/\/UMz\nBN1Wj2CPBToz6cU4zPYV60ioM7wrlC+oH3S5wHMX9MhcWKfB+3OX23ATDpzpeqRA\nZP6krCSvLQkJHLD5KhsRFNazsr2ZL455fjdpPRI6WkfORR9\/UhN5CHClXpYPvlJR\nuy3gdBFJHu4gsa97ffEv1nAnkPwcYGY4aH13CN797hvxMRJ81d4GZ8sYVkrai9vX\nRHg4kypntsULked+ubOwINhKkRm8rfFpaHKtABEBAAH+CQMI7GoCgetuuMBgYedf\nCVqJ2nYRumP6MlcxMEPLEfbQraFP+0mo4\/xC+g44Yi4oT5nNI4LuSJUlUdXG6cvV\nF7BWyK8U1UovtJcefiJM1m6aUDEXEC9nKT6PMh3boFs8H1sXjbn4CfUBVoLydpVM\naoHM\/DO7E59YFsngTfoD4JWL5O7COkhwpBNOyRV2+dZKLnqBK9hDwnCbqOYcRyyx\nistp54KE5lF64ELUHY8tKezG7WMGKEgERBPF1OBPkpt+RgGxE4yqt0evLGxEiphJ\nFH6d4RuIZ97T+Gc0hTZ8rWHuG1oEUtkPXo970wklKx2tEkzCIh9KgJMscbzM9MLJ\nj98NaEeVLWM6Dxqz743Bx+HjyYBpewgo9\/0iPZfBvLux74p5GIZxeVMGQUQHMK8C\naEC6QwxdfUI4FhGpyVUKkBfRe9cosFTnL65QZQJCmLB7MH+fsDr6qiZqTqsxCYbr\nRbV3FhUmecQoMVah5c4bTwDQiyH920K04OcLOcgDjwDqeaxTnqMxGGI5CdH1A4Ao\nwm9cjVHLTCJ5saLtiQnwQzFAXq2IIh\/ju3Jo\/CEJrWkxdx\/WGp+Zl\/CReEodhG25\nvo0eqsMg66M+uZG4lRW4n4z71qZx5\/7lp\/N7BTlOKkWA9s114fnJlq70ylJDn9s0\nVkB64lIZE3Eu12owndgyUyDCz+dnjThIStOC5xtC00MI6rtva0v9c0tVSRTmFdf8\nRa03yNUkjBC4rM506tehVqnIgSnb7SS9oLg4Npr0TngbKvEVD1ovV7DOvGmRVhbq\nm0ezTnYsy3hqRUM7ba4oN3oI01sBB6+h61vEze9XTBkmiaXVcINKdBGxGJmAr3wb\n6ibMjT8UNvqJpy3XC7GWNI4hS9qnv34vcVGXlPZW+zyItkOUi+LHtmVDz3VIuvjX\nBG18Gk7iBt8RzTJKZW5uaWZlciBIYWxsIDxjYXJlZXJzQHRlc3RtYWlsLnBsYXl0\nb3BzZWNyZXQuY29tPsLAbQQTAQoAFwUCVgrStAIbLwMLCQcDFQoIAh4BAheAAAoJ\nEADRtGkDLkBTdhMIAIXSRAf1iLeWQdrnN+bZnd\/HwfIWHC5hQ3yBs7+jUNqTXLxK\nF2WvRajBwcd7NPQqrb7h7VvYBiNajLpNHLGB6706DN36jze0P\/g2ekVJm0TVV65x\neqJdjdx21cT9dGH71QNjamNH1XX0eb9SDS2JutdNd1wvInOCriw9U2qIsA3QtAng\nNHQjaQLHylMx8HjeTi0JpIFIOOkmL0iFm61jUalxHhdGLJOliT+2YBiPNL3WCnsL\nSZPJqXwOBUov1V8XaZWCHowftbE+dS2S+aGk3Ju7UmSMgtRxOevU4m1flyz0Hnp0\n8feVr36RnjV1rZKEdmacpTQ60kXxdRcbcrlcxj3HwUYEVgrStAEEAK9CWHLE1hvI\nXmDPeeVXBBLOYqS5jwqKJ34kHC\/BhUjRznr\/5UUD\/lJBN13othv+c32Mvtk0X2qa\nwJIBzVgic5Js8YTdz3XuyR\/qIJtOYFwZ1ZYoX9zaMy387lupUGCg9t82fgRKsmV8\nzJgAQiWimPmvd40icuF4WbHz4p4C1gq7ABEBAAH+CQMIbe47lg8YW\/Rgt3blS8ZA\ndQV7lyryfNdxDVfylyo12bJPCp9jsVTRs8tXhEUY5nyqmck4V1h9QlmoNwHzMTmn\n22emnaGhaVnPlZfUXLNkpDOuBb4ZeaJEQSgVq5voGsoWNa7hIJqA52KTHTZGPq3w\n5NjkCC\/tjAcv2OR43qRtUmy6de5cc73SZ3qyt0fRMFyfBnEDL8mMxZXdj3048tAG\n4bpdJF6GOgnboXItmz6VKaySI+d3+JsqbBGJ+vQpRXCxpcMe\/6QdK0C\/yP9nZOs8\npwn33emYaABnbMB4nVveNSoFY8xdCsla4D2hjW2o9JvVyTIhIW\/tA0bk053LYItX\n\/1Gxi9PRPbXm9Q0s6t8boLk0SNcWc0HxtA3BaaHvOZVZB1+q6SmryWI3S9vwVh1i\nHGNF16uDj7pY3CUmA7\/pA+ZANbaLdDsiUwiC3yaOIbwKhYXpZBwvJYjIUo77PHx0\nhbkxjf5XQR36S959TZal92Bn\/wwIBcLBAwQYAQoADwUCVgrStAUJDwmcAAIbLgCo\nCRAA0bRpAy5AU50gBBkBCgAGBQJWCtK0AAoJEPf1auTMnpjsh\/IEAID5A+7bxZox\nXu9ojQDFLbqtxyKVfKU5tZYb8T+PXTRVFT8a3DWmG\/\/R9TwcHMBIKn\/4onGgLBXQ\njow2YdzUfT6ZXCIhxwjrkWjn4YBtynlwgPe1yQnAxMV8EU86KsvH9crx4EzahV+m\nK6DQ4ZpQ\/6\/zGKXAJLwjIIH0x64VotexRoMH\/1i6vevGyL\/qOogULxmsfppEj72d\nBf1AWEmnFrTWVW8H+Lly\/g8NPzjmAKJlQkw+pVkiqDVJLbN2AAWkfIKy69DAU11S\nQiHKOAfdV+qm6xNovCFmtxhfvKwJqB0I6FFK+FUhFpyofgMh0XmfrQ6azScejuQx\ncrvPdrEFWX5U8W\/K8FevWqKeSA2UkLByiD\/qMNWWs\/Cuj5Zvk0iwoJIZJOtBIBbx\nnFHAHyegDgS+G5cf5g9tgX0X9BmyuYmAln2lL2VCL1D5Bc7054y47NIPEJATvVXP\nEyVX6NBZrcvVEpVab9sJY9ngZ5rxSEBKwmPQ5ZCLxeTrOcF4CTsfjeQnv\/DHwUYE\nVgrStAEEAMb8\/W\/V6y2oViEqhlLX9rYnIa+BZO4ccXWGFNQLhFjN3xZK\/tzSif\/a\n17fPsqRU+8lqSe85+ZWzOPmlv9LPuh\/JSCPojbzbkm1nC1BsBHMdfbkpYscN4jt9\nPWcJJDF13D9RGsp0u3bhhyccIWY\/SQe27GnZqy0OVeWtYVO1ezaHABEBAAH+CQMI\nEnnrHP2pF1lgwFWJw4gvHB\/fWmaZCSod2iPPIJ5U5mQ5XLG791iynzBTgwVelAds\nF+lQ8Ubuyks\/b+rMzSA4LXld0TpYBEZN+nuJ\/qGRbZbXNEPvJHfgTJ5JgSJN4jPv\n5DU\/bxR8VopT2tzBVcvpGopn\/Yll9g1Q88alSYvRTYWRT+HhVkaEEso1pyGI+q2e\n4fTh8XtoN5dRyfc9fB07gGNdNB4hurpKEl\/mvCRAlk0A7\/aqIFXMOy0ACTSSVJIE\nBY6H4xYnVP30Jbk3UdNHAiHxwC3iV6E1iUL9IAs7v01jfOsyS2MTxU58Lwav9e+z\nydg85KDR8dgLztnHUzyxJq2GR4zh6BSoN\/NaXqNwYWRkkibsQXCEKV\/IcLpzvmk9\nqPoMBHeIPmT2XZ5sPXUsqvLiRL7Um5VgN5e+DK2Pia1DU0mp4ew5LBGfIH2scRSN\nJI3+sJg4BV7eXB3ZS0m4UDNS5ZaEuX8y9kDfuo2bsyMJbbRBqsLBAwQYAQoADwUC\nVgrStAUJDwmcAAIbLgCoCRAA0bRpAy5AU50gBBkBCgAGBQJWCtK0AAoJEAq8NKmf\nG3h7jfAD+wXkTUdVbbSOv7boDX7ACcGyNcoUzWHL651IKA2R\/ZNFGXNRkU6HUMcO\nCKQBH6naU9wGFmsHXueK70GHCo3XHGK0OyFkyQvo0Z8aQtkXeBGgJ7KcJ1ppWxZQ\n+DLKE3YxLcZjhAb6aUB6ZBETBZkSYFGiM9TqQLxM\/mbPhf8vWOXBLa8H\/2LeRXMe\noF6tg5vOfkKdXDBIuYdruviSYNunaF0D5M9bDk+FnwfF1zw0XoeJSF6tWOSjiGii\nULh+1Mn6elkc2hhVM+PGHSiAzncdmSKm1lh2FVkvS3UqmpkQf+6Jojp440JWeGPA\nBeWVIKWyw5\/d9L+CsPFHRD49bkM6tOFufBKag8iywPDKiFsro37Eauj60AVVZpAz\npMeibHkzgxzlcrW9x7Wmdd5jEkUaS9MSvyYuV1gkCxifF1qxGYuRAAtO4Twzd1j4\nKIIaBVOm7S2GBmzBcF+Txp6wNyFGFDhouWRdoTvwXZWf7lHow7aa7dmA+jKRE7fk\nDOzJa+W3IMxfqtM=\n=ag9L\n-----END PGP PRIVATE KEY BLOCK-----",
        passphrase: "test",
};

const loadKey0 = function () { return Kbpgp.loadKey(key0.privateKey, key0.passphrase); };
const loadKey1 = function () { return Kbpgp.loadKey(key1.privateKey, key1.passphrase); };
const loadKeys = function () { return Promise.all([loadKey0(), loadKey1()]); };

const secretMessage = 'A secret message';

const signEncryptFrom0To1 = function (text: string) {
        return loadKeys().then(function (instances) {
                const from = instances[0];
                const to = instances[1];
                return Kbpgp.signEncrypt({ from, to, text });
        });
};

const decryptVerifyTo1 = function (ciphertext: string) {
        return loadKey1().then(function (instance) {
                return Kbpgp.decryptVerify(instance, ciphertext);
        });
};

const encryptDecryptTo1 = function (text: string) {
        return signEncryptFrom0To1(text).then(decryptVerifyTo1);
};

describe('Kbpgp', function () {
        describe('generateKeyPair (may take a few mins)', function () {
                it('should generate key pair without error', function () {
                        return Kbpgp.generateKeyPair('john@smith.com');
                })
        });

        describe('loadKey', function () {
                it('should load key without error', function () {
                        return loadKey0();
                })
        });

        describe('signEncrypt', function () {
                it('should encrypt without error', function () {
                        return signEncryptFrom0To1(secretMessage);
                })
        });

        describe('decryptVerify', function () {
                it('should decrypt without error', function () {
                        const promise = encryptDecryptTo1(secretMessage);
                        return Chai.assert.eventually.equal(
                                promise, secretMessage);
                })
        });
});
