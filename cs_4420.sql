-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2015 at 12:20 AM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs_4420`
--

-- --------------------------------------------------------

--
-- Table structure for table `game`
--

CREATE TABLE IF NOT EXISTS `game` (
  `gID` int(11) NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `game`
--

INSERT INTO `game` (`gID`, `title`, `description`) VALUES
(1, 'Classic', 'Classic game mode of Humans v Zombies. Every participating player begins the game as an human except for Patient Zero who is the original zombie that is determined at random at game start. The objective for the zombies is to tag/infect out all the human players. The objective for the humans is to survive long enough for the zombies to starve. A zombie will starve if it has not tagged/infected a human in the past 48 hours. The humans will also win if they survive longer than the operational window (Length of game).');

-- --------------------------------------------------------

--
-- Table structure for table `gamesession`
--

CREATE TABLE IF NOT EXISTS `gamesession` (
  `sID` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `gType` int(11) NOT NULL,
  `dateStart` datetime NOT NULL,
  `dateFinish` datetime DEFAULT NULL,
  `topH` int(11) NOT NULL,
  `topZ` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gamesession`
--

INSERT INTO `gamesession` (`sID`, `title`, `gType`, `dateStart`, `dateFinish`, `topH`, `topZ`) VALUES
(1, 'The Cold Virus Begins', 1, '2015-11-17 00:00:00', '2015-12-09 00:00:00', 0, 0),
(2, 'Project Virus Cold', 1, '2015-12-14 00:00:00', '2015-12-21 00:00:00', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `gamestats`
--

CREATE TABLE IF NOT EXISTS `gamestats` (
  `sID` int(11) NOT NULL,
  `pID` int(11) NOT NULL,
  `badge` int(6) NOT NULL,
  `hScore` datetime DEFAULT NULL,
  `zScore` int(10) unsigned NOT NULL,
  `lastKill` datetime DEFAULT NULL,
  `originalZ` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gamestats`
--

INSERT INTO `gamestats` (`sID`, `pID`, `badge`, `hScore`, `zScore`, `lastKill`, `originalZ`) VALUES
(1, 1, 111112, NULL, 0, NULL, 0),
(1, 2, 264982, '2015-11-23 14:00:00', 1, '2015-11-25 11:20:14', 0),
(1, 4, 444444, NULL, 0, NULL, 0),
(1, 6, 666666, NULL, 0, NULL, 1),
(2, 2, 458578, NULL, 0, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE IF NOT EXISTS `players` (
  `pID` int(10) unsigned NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `dname` varchar(255) NOT NULL,
  `email` varchar(256) NOT NULL,
  `pass` varchar(10) NOT NULL,
  `gender` char(1) NOT NULL,
  `gm` int(11) NOT NULL DEFAULT '0',
  `gameCount` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`pID`, `fname`, `lname`, `dname`, `email`, `pass`, `gender`, `gm`, `gameCount`) VALUES
(1, 'Ben', 'Matson', 'dragonMaster', '', 'dragon', 'M', 1, 0),
(2, 'Ben', 'Lexa', 'Crudball', '', 'ball', 'M', 1, 0),
(3, 'John', 'Doe', 'TurtleDoe', '', 'turtle', 'M', 0, 0),
(4, 'Jill', 'Hill', 'fairyTale', '', 'jack', 'F', 0, 0),
(5, 'Billy', 'Bob', 'Joe', '', 'joe', 'M', 0, 0),
(6, 'Penelope', 'Hutchinson', 'theDestroyer', '', 'destroy', 'F', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `game`
--
ALTER TABLE `game`
  ADD PRIMARY KEY (`gID`);

--
-- Indexes for table `gamesession`
--
ALTER TABLE `gamesession`
  ADD PRIMARY KEY (`sID`);

--
-- Indexes for table `gamestats`
--
ALTER TABLE `gamestats`
  ADD PRIMARY KEY (`sID`,`pID`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`pID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `game`
--
ALTER TABLE `game`
  MODIFY `gID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `gamesession`
--
ALTER TABLE `gamesession`
  MODIFY `sID` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `pID` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
