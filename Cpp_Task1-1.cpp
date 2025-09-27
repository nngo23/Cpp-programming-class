#include <iostream>
#include <string>
#include <vector>
#include <tuple>
using namespace std;

int main() {
    vector<string> days = {"Sun","Mon","Tue","Wed","Thu","Fri","Sat"};
    vector<double> temperature = {0,5.457345,11.89078,15.02356,7.7893567,22,26.56};
    double max_i = 0;
    cout << "Day in a week and its temperature in Celsius degree: " << endl;
    for (int i = 0; i < 7; i++) {
        cout << days[i] << " & " << temperature[i] << " , ";
        if (temperature[i] < 10) {
            cout << "Cold day" << endl;
        } else if (temperature[i] >= 10 && temperature[i] <= 20 ) {
            cout << "Okay day" << endl;
        } else {
            cout << "Warm day" << endl;
        }
        if (temperature[i] > temperature[max_i]) {
            max_i = i;
        }
    }
    tuple<string,double> warmest_day = {days[max_i],temperature[max_i]};
    cout << "The warmest day is: " << get<0>(warmest_day) << " with " << get<1>(warmest_day) << " °C" << endl;
    return 0;
}