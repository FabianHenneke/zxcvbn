var bruteforce_match, build_dict_matcher, build_ranked_dict, date_match, date_rx, dictionary_match, digits_match, digits_rx, empty, english_match, enumerate_h4x0r_subs, female_name_match, findall, h4x0r_match, h4x0r_sub, h4x0r_table, male_name_match, max_coverage_subset, password_match, ranked_english, ranked_female_names, ranked_male_names, ranked_passwords, ranked_surnames, relevent_h4x0r_subtable, repeat, repeat_match, sequence_match, sequences, spatial_match, spatial_match_helper, surname_match, year_match, year_rx,
  __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

build_ranked_dict = function(unranked_list) {
  var i, result, word, _i, _len;
  result = {};
  i = 1;
  for (_i = 0, _len = unranked_list.length; _i < _len; _i++) {
    word = unranked_list[_i];
    result[word] = i;
    i += 1;
  }
  return result;
};

ranked_english = build_ranked_dict(english);

ranked_surnames = build_ranked_dict(surnames);

ranked_male_names = build_ranked_dict(male_names);

ranked_female_names = build_ranked_dict(female_names);

ranked_passwords = build_ranked_dict(passwords);

spatial_match = function(password) {
  var best, best_coverage, best_graph_name, candidate, candidate_coverage, graph_name, match, unidirectional, _i, _j, _len, _len2, _ref;
  best = [];
  best_coverage = 0;
  best_graph_name = null;
  _ref = ['qwerty', 'dvorak', 'keypad', 'mac_keypad'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    graph_name = _ref[_i];
    candidate = spatial_match_helper(password, graph_name, unidirectional = false);
    candidate_coverage = 0;
    for (_j = 0, _len2 = candidate.length; _j < _len2; _j++) {
      match = candidate[_j];
      candidate_coverage += match.token.length;
    }
    if (candidate_coverage > best_coverage || (candidate_coverage === best_coverage && candidate.length < best.length)) {
      best = candidate;
      best_coverage = candidate_coverage;
      best_graph_name = graph_name;
    }
  }
  if (best.length) {
    return best;
  } else {
    return [];
  }
};

spatial_match_helper = function(password, graph_name, unidirectional) {
  var adj, adjacents, cur_char, cur_direction, found, found_direction, graph, i, j, match_direction, prev_char, result, _i, _len, _ref;
  result = [];
  graph = window[graph_name];
  i = 0;
  while (i < password.length) {
    j = i + 1;
    match_direction = -1;
    while (true) {
      _ref = password.slice(j - 1, j + 1 || 9e9), prev_char = _ref[0], cur_char = _ref[1];
      found = false;
      found_direction = -1;
      cur_direction = -1;
      adjacents = graph[prev_char] || [];
      for (_i = 0, _len = adjacents.length; _i < _len; _i++) {
        adj = adjacents[_i];
        cur_direction += 1;
        if (adj && __indexOf.call(adj, cur_char) >= 0) {
          found = true;
          found_direction = cur_direction;
          if (match_direction === -1) match_direction = found_direction;
        }
      }
      if (found && (!unidirectional || found_direction === match_direction)) {
        j += 1;
      } else {
        if (j - i > 1) {
          result.push({
            pattern: 'spatial',
            ij: [i, j - 1],
            token: password.slice(i, j),
            graph: graph_name,
            unidirectional: unidirectional,
            turns: turns
          });
        }
        break;
      }
    }
    i = j;
  }
  return result;
};

repeat_match = function(password) {
  var cur_char, i, j, prev_char, result, _ref;
  result = [];
  i = 0;
  while (i < password.length) {
    j = i + 1;
    while (true) {
      _ref = password.slice(j - 1, j + 1 || 9e9), prev_char = _ref[0], cur_char = _ref[1];
      if (password[j - 1] === password[j]) {
        j += 1;
      } else {
        if (j - i > 1) {
          result.push({
            pattern: 'repeat',
            ij: [i, j - 1],
            token: password.slice(i, j),
            repeated_char: password[i]
          });
        }
        break;
      }
    }
    i = j;
  }
  return result;
};

sequences = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '01234567890'
};

sequence_match = function(password) {
  var chr, cur_char, cur_n, direction, i, i_n, j, j_n, prev_char, prev_n, result, seq, seq_candidate, seq_candidate_name, seq_direction, seq_name, _i, _len, _ref, _ref2, _ref3, _ref4;
  result = [];
  i = 0;
  while (i < password.length) {
    j = i + 1;
    seq = null;
    seq_name = null;
    seq_direction = null;
    _ref = ['lower', 'upper', 'digits'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      seq_candidate_name = _ref[_i];
      seq_candidate = sequences[seq_candidate_name];
      _ref2 = (function() {
        var _j, _len2, _ref2, _results;
        _ref2 = [password[i], password[j]];
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          chr = _ref2[_j];
          _results.push(seq_candidate.indexOf(chr));
        }
        return _results;
      })(), i_n = _ref2[0], j_n = _ref2[1];
      if (i_n > -1 && j_n > -1) {
        direction = j_n - i_n;
        if (direction === 1 || direction === -1) {
          seq = seq_candidate;
          seq_name = seq_candidate_name;
          seq_direction = direction;
          break;
        }
      }
    }
    if (seq) {
      while (true) {
        _ref3 = password.slice(j - 1, j + 1 || 9e9), prev_char = _ref3[0], cur_char = _ref3[1];
        _ref4 = (function() {
          var _j, _len2, _ref4, _results;
          _ref4 = [prev_char, cur_char];
          _results = [];
          for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
            chr = _ref4[_j];
            _results.push(seq_candidate.indexOf(chr));
          }
          return _results;
        })(), prev_n = _ref4[0], cur_n = _ref4[1];
        if (cur_n - prev_n === seq_direction) {
          j += 1;
        } else {
          if (j - i > 1) {
            result.push({
              pattern: 'sequence',
              ij: [i, j - 1],
              token: password.slice(i, j),
              sequence_name: seq_name,
              sequence_space: seq.length,
              ascending: seq_direction === 1
            });
          }
          break;
        }
      }
    }
    i = j;
  }
  return result;
};

build_dict_matcher = function(dict_name, ranked_dict) {
  return function(password) {
    var match, matches, _i, _len;
    matches = max_coverage_subset(dictionary_match(password, ranked_dict));
    for (_i = 0, _len = matches.length; _i < _len; _i++) {
      match = matches[_i];
      match.dictionary_name = dict_name;
    }
    return matches;
  };
};

english_match = build_dict_matcher('words', ranked_english);

surname_match = build_dict_matcher('surnames', ranked_surnames);

male_name_match = build_dict_matcher('male_names', ranked_male_names);

female_name_match = build_dict_matcher('female_names', ranked_female_names);

password_match = build_dict_matcher('passwords', ranked_passwords);

h4x0r_table = {
  a: ['4', '@'],
  b: ['8'],
  c: ['(', '{', '[', '<'],
  e: ['3'],
  g: ['6', '9', '&'],
  i: ['1', '!', '|'],
  l: ['1', '|', '7'],
  o: ['0'],
  s: ['$', '5'],
  t: ['+', '7'],
  x: ['%'],
  z: ['2']
};

relevent_h4x0r_subtable = function(password) {
  var chr, filtered, letter, password_chars, relevent_subs, sub, subs, _i, _len;
  password_chars = {};
  for (_i = 0, _len = password.length; _i < _len; _i++) {
    chr = password[_i];
    password_chars[chr] = true;
  }
  filtered = {};
  for (letter in h4x0r_table) {
    subs = h4x0r_table[letter];
    relevent_subs = (function() {
      var _j, _len2, _results;
      _results = [];
      for (_j = 0, _len2 = subs.length; _j < _len2; _j++) {
        sub = subs[_j];
        if (sub in password_chars) _results.push(sub);
      }
      return _results;
    })();
    if (relevent_subs.length > 0) filtered[letter] = relevent_subs;
  }
  return filtered;
};

enumerate_h4x0r_subs = function(table) {
  var chr, dedup, h4x_chr, helper, k, keys, sub, sub_dict, sub_dicts, subs, _i, _j, _len, _len2, _ref;
  keys = (function() {
    var _results;
    _results = [];
    for (k in table) {
      _results.push(k);
    }
    return _results;
  })();
  subs = [[]];
  dedup = function(subs) {
    var assoc, deduped, k, label, members, sub, v, _i, _len;
    deduped = [];
    members = {};
    for (_i = 0, _len = subs.length; _i < _len; _i++) {
      sub = subs[_i];
      assoc = (function() {
        var _len2, _results;
        _results = [];
        for (v = 0, _len2 = sub.length; v < _len2; v++) {
          k = sub[v];
          _results.push([k, v]);
        }
        return _results;
      })();
      assoc.sort();
      label = ((function() {
        var _len2, _results;
        _results = [];
        for (v = 0, _len2 = assoc.length; v < _len2; v++) {
          k = assoc[v];
          _results.push(k + ',' + v);
        }
        return _results;
      })()).join('-');
      if (!(label in members)) {
        members[label] = true;
        deduped.push(sub);
      }
    }
    return deduped;
  };
  helper = function(keys) {
    var dup_h4x_index, first_key, h4x_chr, i, next_subs, rest_keys, sub, sub_alternative, sub_extension, _i, _j, _len, _len2, _ref, _ref2;
    if (!keys.length) return;
    first_key = keys[0];
    rest_keys = keys.slice(1);
    next_subs = [];
    _ref = table[first_key];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      h4x_chr = _ref[_i];
      for (_j = 0, _len2 = subs.length; _j < _len2; _j++) {
        sub = subs[_j];
        dup_h4x_index = -1;
        for (i = 0, _ref2 = sub.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
          if (sub[i][0] === h4x_chr) {
            dup_h4x_index = i;
            break;
          }
        }
        if (dup_h4x_index === -1) {
          sub_extension = sub.concat([[h4x_chr, first_key]]);
          next_subs.push(sub_extension);
        } else {
          sub_alternative = sub.slice(0);
          sub_alternative.splice(dup_h4x_index, 1);
          sub_alternative.push([h4x_chr, first_key]);
          next_subs.push(sub);
          next_subs.push(sub_alternative);
        }
      }
    }
    subs = dedup(next_subs);
    return helper(rest_keys);
  };
  helper(keys);
  sub_dicts = [];
  for (_i = 0, _len = subs.length; _i < _len; _i++) {
    sub = subs[_i];
    sub_dict = {};
    for (_j = 0, _len2 = sub.length; _j < _len2; _j++) {
      _ref = sub[_j], h4x_chr = _ref[0], chr = _ref[1];
      sub_dict[h4x_chr] = chr;
    }
    sub_dicts.push(sub_dict);
  }
  return sub_dicts;
};

empty = function(obj) {
  var k;
  return ((function() {
    var _results;
    _results = [];
    for (k in obj) {
      _results.push(k);
    }
    return _results;
  })()).length === 0;
};

h4x0r_sub = function(password, sub) {
  var chr;
  return ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = password.length; _i < _len; _i++) {
      chr = password[_i];
      _results.push(sub[chr] || chr);
    }
    return _results;
  })()).join('');
};

h4x0r_match = function(password) {
  var best, best_coverage, best_sub, candidate, candidates, coverage, i, j, match, matcher, sub, token, _i, _j, _k, _l, _len, _len2, _len3, _len4, _ref, _ref2, _results;
  best = [];
  best_sub = null;
  best_coverage = 0;
  _ref = enumerate_h4x0r_subs(relevent_h4x0r_subtable(password));
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    sub = _ref[_i];
    if (empty(sub)) break;
    candidates = (function() {
      var _j, _len2, _ref2, _results;
      _ref2 = [password_match, english_match, surname_match, female_name_match, male_name_match];
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        matcher = _ref2[_j];
        _results.push(matcher(h4x0r_sub(password, sub)));
      }
      return _results;
    })();
    for (_j = 0, _len2 = candidates.length; _j < _len2; _j++) {
      candidate = candidates[_j];
      coverage = 0;
      for (_k = 0, _len3 = candidate.length; _k < _len3; _k++) {
        match = candidate[_k];
        coverage += match.token.length;
      }
      if (coverage > best_coverage || (coverage === best_coverage && candidate.length < best.length)) {
        best = candidate;
        best_sub = sub;
        best_coverage = coverage;
      }
    }
  }
  _results = [];
  for (_l = 0, _len4 = best.length; _l < _len4; _l++) {
    match = best[_l];
    _ref2 = match.ij, i = _ref2[0], j = _ref2[1];
    token = password.slice(i, j + 1 || 9e9);
    if (token.toLowerCase() === match.matched_word) continue;
    match.h4x0rd = true;
    match.token = token;
    match.sub = best_sub;
    _results.push(match);
  }
  return _results;
};

digits_rx = /\d+/;

digits_match = function(password) {
  var i, j, match, _i, _len, _ref, _ref2, _results;
  _ref = findall(password, digits_rx);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    _ref2 = match.ij, i = _ref2[0], j = _ref2[1];
    _results.push({
      pattern: 'digits',
      ij: [i, j],
      token: password.slice(i, j + 1 || 9e9)
    });
  }
  return _results;
};

year_rx = /19\d{2}|200\d|201\d/;

year_match = function(password) {
  var i, j, match, _i, _len, _ref, _ref2, _results;
  _ref = findall(password, year_rx);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    _ref2 = match.ij, i = _ref2[0], j = _ref2[1];
    _results.push({
      pattern: 'year',
      ij: [i, j],
      token: password.slice(i, j + 1 || 9e9)
    });
  }
  return _results;
};

date_rx = /(\d{1,2})( |-|\/|\.|_)?(\d{1,2}?)\2?(\d{2}|19\d{2}|200\d|201\d)/;

date_match = function(password) {
  var day, i, j, k, match, matches, month, separator, year, _i, _len, _ref, _ref2, _ref3, _ref4;
  matches = [];
  _ref = findall(password, date_rx);
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    match = _ref[_i];
    if (match[0].length <= 4) continue;
    _ref2 = (function() {
      var _j, _len2, _ref2, _results;
      _ref2 = [1, 3, 4];
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        k = _ref2[_j];
        _results.push(parseInt(match[k]));
      }
      return _results;
    })(), day = _ref2[0], month = _ref2[1], year = _ref2[2];
    separator = match[2] || '';
    if ((12 <= month && month <= 31) && day <= 12) {
      _ref3 = [month, day], day = _ref3[0], month = _ref3[1];
    }
    if (day > 31 || month > 12) continue;
    _ref4 = match.ij, i = _ref4[0], j = _ref4[1];
    matches.push({
      pattern: 'date',
      ij: [i, j],
      token: password.slice(i, j + 1 || 9e9),
      separator: separator,
      day: day,
      month: month,
      year: year
    });
  }
  return matches;
};

findall = function(password, rx) {
  var match, matches;
  matches = [];
  while (true) {
    match = password.match(rx);
    if (!match) break;
    match.ij = [match.index, match.index + match[0].length - 1];
    matches.push(match);
    password = password.replace(match[0], repeat(' ', match[0].length));
  }
  return matches;
};

repeat = function(chr, n) {
  var i;
  return ((function() {
    var _results;
    _results = [];
    for (i = 1; 1 <= n ? i <= n : i >= n; 1 <= n ? i++ : i--) {
      _results.push(chr);
    }
    return _results;
  })()).join('');
};

/*
# returns a list of objects for every substring of password that is a member of dictionary.
#
# ranked_dict must be an object mapping a word to its frequency rank.
*/

dictionary_match = function(password, ranked_dict) {
  var i, j, len, password_lower, rank, result, word;
  result = [];
  len = password.length;
  password_lower = password.toLowerCase();
  for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
    for (j = i; i <= len ? j < len : j > len; i <= len ? j++ : j--) {
      if (password_lower.slice(i, j + 1 || 9e9) in ranked_dict) {
        word = password_lower.slice(i, j + 1 || 9e9);
        rank = ranked_dict[word];
        result.push({
          pattern: 'dictionary',
          ij: [i, j],
          token: password.slice(i, j + 1 || 9e9),
          matched_word: word,
          rank: rank
        });
      }
    }
  }
  return result;
};

max_coverage_subset = function(matches) {
  var best_chain, best_coverage, decoder;
  best_chain = [];
  best_coverage = 0;
  decoder = function(chain, rest) {
    var coverage, match, min_j, next, next_chain, next_rest, _i, _j, _len, _len2, _results;
    min_j = Math.min.apply(null, (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rest.length; _i < _len; _i++) {
        match = rest[_i];
        _results.push(match.ij[1]);
      }
      return _results;
    })());
    _results = [];
    for (_i = 0, _len = rest.length; _i < _len; _i++) {
      next = rest[_i];
      if (!(next.ij[0] <= min_j)) continue;
      next_chain = chain.concat([next]);
      next_rest = (function() {
        var _j, _len2, _results2;
        _results2 = [];
        for (_j = 0, _len2 = rest.length; _j < _len2; _j++) {
          match = rest[_j];
          if (match.ij[0] > next.ij[1]) _results2.push(match);
        }
        return _results2;
      })();
      coverage = 0;
      for (_j = 0, _len2 = next_chain.length; _j < _len2; _j++) {
        match = next_chain[_j];
        coverage += match.token.length;
      }
      if (coverage > best_coverage || (coverage === best_coverage && next_chain.length < best_chain.length)) {
        best_coverage = coverage;
        best_chain = next_chain;
      }
      _results.push(decoder(next_chain, next_rest));
    }
    return _results;
  };
  decoder([], matches);
  return best_chain;
};

bruteforce_match = function(password) {
  var cardinality, chr, digits, lower, ord, symbols, upper, _i, _len, _ref;
  _ref = [false, false, false, false], lower = _ref[0], upper = _ref[1], digits = _ref[2], symbols = _ref[3];
  for (_i = 0, _len = password.length; _i < _len; _i++) {
    chr = password[_i];
    ord = chr.charCodeAt(0);
    if ((0x30 <= ord && ord <= 0x39)) {
      digits = true;
    } else if ((0x41 <= ord && ord <= 0x5a)) {
      upper = true;
    } else if ((0x61 <= ord && ord <= 0x7a)) {
      lower = true;
    } else {
      symbols = true;
    }
  }
  cardinality = 0;
  if (digits) cardinality += 10;
  if (upper) cardinality += 26;
  if (lower) cardinality += 26;
  if (symbols) cardinality += 33;
  return [
    {
      pattern: 'bruteforce',
      ij: [0, password.length - 1],
      token: password,
      cardinality: cardinality
    }
  ];
};