#include <iostream>
#include <string>
#include <map>
using namespace std;

int main() {
    map<string, double> day_temp = {{"Sun", 0}, {"Mon", 5.457345}, {"Tue", 11.89078},
    {"Wed", 15.02356}, {"Thu", 7.7893567}, {"Fri", 22}, {"Sat", 26.56}};
    map<string,pair<double,char>> day_weather;
    day_weather["Sun"].second = 'S';
    day_weather["Mon"].second = 'C';
    day_weather["Tue"].second = 'R';
    day_weather["Wed"].second = 'S';
    day_weather["Thu"].second = 'C';
    day_weather["Fri"].second = 'R';
    day_weather["Sat"].second = 'S';
    for (const auto & a : day_temp) {
        day_weather[a.first].first = a.second; 
    }
    for (const auto & b : day_temp) {
        cout << b.first << " : " << b.second << "°C, ";
        switch (day_weather[b.first].second) {
            case 'S': cout << "Sunny"; break;
            case 'C': cout << "Cloudy"; break;
            case 'R': cout << "Rainy"; break;
            default: cout << "Unknown";
        }
        cout << endl;
    }
    double sum = 0;
    for (const auto & c : day_temp) {
        sum += c.second;
    }
    double average_temp = sum/day_temp.size();
    cout << "The average temperature is: " << average_temp << " °C" << endl;
    return 0;
}