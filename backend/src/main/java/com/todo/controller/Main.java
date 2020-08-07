package com.todo.controller;

import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        method2();
    }

    public static void method1(){
        String[] words = {"a", "b", "c", "a", "a", "b", "b", "c", "a", "b", "b"};
        HashMap<String, Integer> wordToCount = new HashMap<>();

        for(String word: words) {   // iterate by array of words
            Integer wordCount = wordToCount.get(word);  // get word count by key
            wordToCount.put(word, wordCount!=null? wordCount+1: 1); // put word to the map as a key with wordCount value=1,
                                                                    // else increment if such word already exists in map
        }

        wordToCount
                .entrySet() // returns a set view of the mappings contained in this map., i.e. Set<Map.Entry<String, Integer>>
                .stream() // returns a sequential stream with this collection as its source.
                .sorted(Map.Entry.comparingByValue( // returns a sorted stream with comparator function (sorting by value)
                        (v1, v2) -> v2-v1)) // comparator function, same as Comparator.reverseOrder()
                .forEach(System.out::println); // consumer println function
    }

    public static void method2() {
        String[] words = {"a", "b", "c", "a", "a", "b", "b", "c", "a", "b", "b"};

        Arrays.stream(words)
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue(
                        Comparator.reverseOrder()))
                .forEach(System.out::println);
    }

}
