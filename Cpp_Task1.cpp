#include <iostream>
#include <string>
#include <vector>
#include <tuple>
using namespace std;

int main() {
    vector<string> days = {"Sun","Mon","Tue","Wed","Thu","Fri","Sat"};
    vector<double> temperature = {0,5.457345,11.89078,15.02356,7.7893567,22,26.56};
    for (int i = 0; i < 7; i++) {
        cout << "Day of a week and its temperature:" << days[i] << "&" << temperature[i] << endl;
        if (temperature[i] < 10) {
            cout << "Cold day" << endl;
        } else if (temperature[i] <= 10 || temperature[i] >= 20 ) {
            cout << "Okay day" << endl;
        } else {
            cout << "Warm day" << endl;
        }
    }
    //tuple<string,double> warmest_day = {""}
    
    return 0;
}