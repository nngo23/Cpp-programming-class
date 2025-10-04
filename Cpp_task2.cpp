#include <iostream>
#include <string>
#include <fstream>
#include <algorithm>
#include <vector>
using namespace std;

template <typename R>
R Average(R* arr, int size) {
    R sum = 0;
    if (size != 0) {
        for (int a=0; a<size; a++) {
            sum += arr[a];
        }
        return sum/size;
    } else {
        throw runtime_error("No reading available, cannot calculate average");
    }
}    
  
class WeatherStation {
public:
    string location;
    float* reading;
    int i; //count
    int range;
    WeatherStation(string line, int limit = 200):location(line), range(limit), i(0) {reading= new float[range];}
    ~WeatherStation() {delete[] reading;}
    void addReading(float value) {
        if (i < range) {
        reading[i++]=value;
        } else {
            throw runtime_error("Cannot add more readings due to full memory");
        }
    }
    void printReadings() {
        cout << "Location: " << location << endl;
        cout << "Readings: ";
        for (int j=0; j<i; j++) {
            cout << reading[j] << " ";
        }
        cout << endl;
    }
    void saveToFile(string filename) {
        ofstream file(filename);
        if (file.is_open()) {
            file << location << endl;
            for (int j=0; j<i; j++) {
                file << reading[j] << " ";}
            file.close();
            cout << "Saved to file: " << filename << endl;
            
        } else {
            cout << "Unable to open file." << endl;
        }
    }
    static WeatherStation* reconstructFrom(string filename) { 
        ifstream file(filename);
        string line;
        if (file.is_open()) {
            getline(file, line);
            WeatherStation* weather_station = new WeatherStation(line);
            float val;
            while (file>>val) {
                (*weather_station).addReading(val);
            }
            file.close();
            return weather_station;
           } else {
            cout << "Unable open file." << endl;
            return nullptr;
        }
    }
    void sortReadings() {
        sort(reading, reading+i);
    }
    double temp_average() {
        return Average(reading, i);
    }
    int QtyAboveThreshold(float threshold) {
        return count_if(reading, reading+i, [threshold](float val1) {return val1>threshold; });
    }
};

int main() {
    WeatherStation WS("Lahti");

    float temperatures[] = {22.5, 24.0, 26.3, 21.8, 25.7};
    for (float c:temperatures) WS.addReading(c);

    WS.sortReadings();
    WS.printReadings();
    cout << "Average: " << WS.temp_average() << endl;
    cout << "Readings above 25°C: " << WS.QtyAboveThreshold(25.0) << endl;

    WS.saveToFile("lahti_readings.txt");

    WeatherStation* WS1 = WeatherStation::reconstructFrom("lahti_readings.txt");
    if (WS1) {
        cout << "\n--- Reconstructed ---\n";
        (*WS1).printReadings();
        delete WS1;
    }

    return 0;
}
